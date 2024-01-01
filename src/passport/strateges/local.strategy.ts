import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UserService) {
        super({ usernameField: 'email' });
      }

  async validate(username: string, pass: string): Promise<any> {
    let user_data = {
        email: username,
        password: pass
    }
    const user = await this.usersService.validate(user_data);
    if(user){
        return user
    }
    return null;
  }
}