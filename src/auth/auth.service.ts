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
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger: Logger = new Logger(AuthService.name);

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    try {
      const { username, password } = signInDto;
      const user: User = await this.userService.findByUsername(username);
      if (user && (await bcrypt.compare(password, user.password))) {
        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken };
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
