import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { LocalStrategy } from './passport/strateges/local.strategy';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport/strateges/passport.strategy';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from './rabbitmq/rabbitmq.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    RmqModule.register({name: "SNAPPY"}),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '10m' },
  }),],
  controllers: [AppController],
  providers: [AppService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
