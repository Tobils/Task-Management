import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  private readonly logger: Logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto) {
    this.logger.debug('This action adds a new user');
    try {
      const { username, password } = createUserDto;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      return await this.userRepository.save({
        username: username,
        password: hashedPassword,
      });
    } catch (error) {
      this.logger.error({ msg: error?.message });
      throw new HttpException(
        {
          statusCode: error?.code || HttpStatus.UNPROCESSABLE_ENTITY,
          data: {
            message: error?.message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async findByUsername(username: string) {
    this.logger.debug(`This action return single user if found !`);
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .where('user.username = :username', { username })
        .leftJoinAndSelect('user.task', 'task')
        .getOne();
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

  async findAll() {
    this.logger.debug(`This action returns all user`);
    try {
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

  async findOne(id: string) {
    this.logger.debug(`This action returns a #${id} user`);
    try {
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.debug(`This action updates a #${id} user`);
    try {
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

  async remove(id: string) {
    this.logger.debug(`This action removes a #${id} user`);
    try {
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
}
