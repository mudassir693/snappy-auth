import { Injectable, UnauthorizedException } from "@nestjs/common";
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
}