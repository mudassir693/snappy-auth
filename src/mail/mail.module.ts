import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';


@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
              transport: {
                  host: process.env.SMTP_HOST,
                  secure: false,
                  auth: {
                    user: process.env.SENDER_MAIL,
                    pass: process.env.SENDER_MAIL_PASSWORD,
                  },
              },
              defaults: {
                  from: `"No Reply" <${config.get('MAIL_FROM')}>`,
              },
              template: {
                  dir: join(__dirname, './templates'),
                  adapter: new HandlebarsAdapter(),
                  options: {
                    strict: true,
                  },
              },
            }),
          inject: [ConfigService],
        }),
      ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}