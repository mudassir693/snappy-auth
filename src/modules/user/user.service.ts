import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";


@Injectable()
export class UserService {
    constructor(private _dbService: DatabaseService) {}

    async validate(user_credential: {email:string, password:string}){
        let user = await this._dbService.user.findFirst({where: {email:user_credential.email, password:user_credential.password}})
        if(user){
           return user 
        }
        let staff = await this._dbService.staff.findFirst({where:{email:user_credential.email, password:user_credential.password}})
        if(staff){
            return staff
        }
        throw new UnauthorizedException()
    }

    async updateStaff(data: any, userId: number){
        try {
            let user = await this._dbService.staff.findUnique({where: {id: userId}})
            if(!user){
                throw new NotFoundException("invalid user ID")
            }
            let updateUser = await this._dbService.staff.update({
                where: {
                    id: user.id
                },
                data: {
                    ...(data.name && {name: data.name}),
                    ...(data.email && {email: data.email}),
                    ...(data.contact_info && {contact_info: data.contact_info}),
                    ...(data.cnic_number && {cnic_number: data.cnic_number}),
                    ...(data.avatar && {avatar: data.avatar})
                }
            })
            return updateUser
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}