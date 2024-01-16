import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { DatabaseModule } from "src/database/database.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { RmqModule } from "src/rabbitmq/rabbitmq.module";
import { MailModule } from "src/mail/mail.module";

@Module({
  imports: [RmqModule.register({name: 'KITCHEN'}), RmqModule.register({name: 'BILLING'}), DatabaseModule, PassportModule, MailModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService] 
})

export class AuthModule {}