import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [DatabaseModule, PassportModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}