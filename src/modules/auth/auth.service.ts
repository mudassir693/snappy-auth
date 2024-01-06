import { BadRequestException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import { Staff, User } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class AuthService {
    constructor(private _dbService: DatabaseService, private _jwtService: JwtService, private _configService: ConfigService, @Inject("KITCHEN") private _kitchenClient: ClientProxy, private _mailService: MailService){}
 
    async SignUp(user_data: any){
        try {
            await this._mailService.AccountConfirmationEmail("Mudassir","asdad")
            return
            let is_user_exist;
            try {
                is_user_exist = await this._dbService.user.findUnique({where: {email: user_data.email}}) 
            } catch (error) {
                throw new BadRequestException(error)   
            }
            if(is_user_exist){
                throw new BadRequestException("user already exists")
            }
            let user = await this._dbService.user.create({data: {
                ...(user_data.name && {name: user_data.name}),
                email: user_data.email,
                password: user_data.password,
                avatar: user_data.avatar || ""
            }})

            if(user){
                return {
                    success: true,
                    user: user
                }
            }
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async Login(user_data: User){
        try {
            let user_payload = {
                email: user_data.email,
                id: user_data.id, 
                admin: false,
                staff: false,
                expires_at: new Date().getTime() + 5 * 60 * 1000
            }
            return await this._jwtService.signAsync(user_payload)

        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async StaffSignUp(staff: any){
        try {
            let is_staff_exist = await this._dbService.staff.findFirst({where: {email: staff.email}})
            if(is_staff_exist){
                throw new BadRequestException("This email is already in use")
            }

            try {
                await this._dbService.$transaction(async (tx) => {
                    const createAccountResult = await tx.account.create({ data: {} });
                    if (!createAccountResult) {
                        throw new BadRequestException("Failed to create account");
                    }
                    const createStaffResult = await tx.staff.create({
                        data: {
                            name: staff.name,
                            email: staff.email,
                            password: staff.password,
                            contact_info: staff?.contact_info,
                            admin: true,
                            account_id: createAccountResult.id,
                        },
                    });
                    if (!createStaffResult) {
                        throw new BadRequestException("Failed to create staff");
                    }
                    await tx.account.update({
                        where: { id: createAccountResult.id },
                        data: { admin_id: createStaffResult.id },
                    });
                    this._kitchenClient.emit('account_created', {...createAccountResult, admin_id: createStaffResult.id})
                });
            } catch (error) {
                console.error("Transaction failed:", error);
                throw new InternalServerErrorException("Transaction failed");
            }
            return {
                success: true
            }
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async StaffLogin(user_data: Staff){
        try {
            let user_payload = {
                email: user_data.email,
                id: user_data.id,
                admin: user_data.admin,
                staff: true,
                expires_at: new Date().getTime() + 5 * 60 * 1000
            }
            return this._jwtService.sign(user_payload)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async GetRefreshToken(data: {email: string, id: string, admin: string, staff: string}){
        try {
            if(data.admin=='false' && data.staff=='false'){
                let user = await this._dbService.user.findFirst({where: {id: parseInt(data.id), email:data.email}})
                if(!user){
                    throw new UnauthorizedException("User not found")
                }
                let user_payload = {
                    email: user.email,
                    id: user.id,
                    admin: false,
                    staff: false,
                    expires_at: new Date().getTime() + 5 * 60 * 1000
                }
                return this._jwtService.sign(user_payload)
            }
            let staff = await this._dbService.staff.findFirst({where: {id: parseInt(data.id), email:data.email}})
            if(!staff){
                throw new UnauthorizedException("Staff not found")
            }
            let user_payload = {
                email: staff.email,
                id: staff.id,
                admin: staff.admin,
                staff: true,
                expires_at: new Date().getTime() + 5 * 60 * 1000
            }
            return this._jwtService.sign(user_payload)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}