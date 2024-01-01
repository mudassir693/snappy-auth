import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "src/passport/guards/jwt-guard";

@Controller('/user')
export class UserController {
    constructor(private _userService: UserService){}
    
    @UseGuards(JwtAuthGuard)
    @Get('/')
    test(@Request() req: any): string{
        return "Hi This is me form user controller"
    }
}