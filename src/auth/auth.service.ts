import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  private readonly logger: Logger = new Logger(AuthService.name);

  async signIn(signInDto: SignInDto) {
    try {
      const { username, password } = signInDto;
      const user: User = await this.userService.findByUsername(username);
      if (user && (await bcrypt.compare(password, user.password))) {
        return { user };
      } else {
        throw new UnauthorizedException('Please check your login credentials');
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          data: {
            message: error?.message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async signUp(signInDto: SignInDto) {
    try {
      return await this.userService.create(signInDto);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          data: {
            message: error?.message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
