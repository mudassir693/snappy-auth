import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
    constructor(private _mailerService: MailerService){}

    async AccountConfirmationEmail(email_payload){
        // const url = `example.com/auth/confirm?token=${token}`;
        await this._mailerService.sendMail({
            to: email_payload.email,
            subject: 'Activate Your Account - Action Required',
            template: './account-verification', 
            context: { 
                name: email_payload.name,
                code: email_payload.code,
            },
        });
    }
}