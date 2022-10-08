import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  private readonly logger: Logger = new Logger(AuthService.name);

  async signIn() {}
  async signUp() {}
}
