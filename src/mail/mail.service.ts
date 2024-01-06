import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
    constructor(private _mailerService: MailerService){}

    async AccountConfirmationEmail(user, token){
        // const url = `example.com/auth/confirm?token=${token}`;
        await this._mailerService.sendMail({
            to: "mudassirsiddiqui27@gmail.com",
            subject: 'Welcome to Nice App! Confirm your Email',
            template: './account-verification', 
            context: { 
                name: user,
                url: token,
            },
        });
    }
}