import { Body, Controller, Get, Post, Query, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "src/passport/guards/local.guard";

@Controller('/auth')
export class AuthController {
    constructor(private _authService: AuthService){}

    @Post('/signup')
    async SignUp(@Body() data: any){
        return await this._authService.SignUp(data);
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async SignIn(@Request() req: any){
        console.log(req.user)
        return this._authService.Login(req.user)
    }

    @Post('/staff/signup')
    async StaffSignUp(@Body() data: any){
        return this._authService.StaffSignUp(data)
    }

    @UseGuards(LocalAuthGuard)
    @Post('/staff/login')
    async StaffSignIn(@Request() req: any){
        console.log(req.user)
        return this._authService.StaffLogin(req.user)
    }

    @Get('/refresh_token')
    async GetRefreshToken(@Query() data: any): Promise<String>{
        return await this._authService.GetRefreshToken(data)
    }

    @Post('otp-verification')
    async VerifyOtp(@Body() data: {code: string, user_id: number}){
        return await this._authService.VerifyOtp(data)
    }

    @Post('regenerate-otp')
    async RegenerateOtp(@Body() data: {user_id: number}){
        return await this._authService.RegenerateOtp(data)
    }
}