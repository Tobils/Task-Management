import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRespository: Repository<Task>,
  ) {}

  private readonly logger: Logger = new Logger(TasksService.name);

  async create(createTaskDto: CreateTaskDto, user: User) {
    this.logger.debug('This action adds a new task');
    try {
      return await this.taskRespository.save({ ...createTaskDto, user: user });
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

  async findAll(user: User) {
    try {
      this.logger.debug(`This action returns all tasks`);
      return await this.taskRespository
        .createQueryBuilder('task')
        .where({ user })
        .getMany();
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

  async findByFilter(filterDto: GetTasksFilterDto, user: User) {
    const { status, search } = filterDto;
    if (Object.keys(filterDto).length) {
      const query = this.taskRespository.createQueryBuilder('task');
      const __status = status ?? TaskStatus.OPEN;
      query.where('task.status = :status', {
        status: __status,
      });

      query.where({ user });

      if (search) {
        query.andWhere(
          `(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))`,
          { search: `%${search}%` },
        );
      }
      this.logger.debug({ __status, search });
      return await query.getMany();
    } else {
      return await this.findAll(user);
    }
  }

  async findOne(id: string, user: User) {
    try {
      this.logger.debug(`This action returns a #${id} task`);
      return await this.taskRespository
        .createQueryBuilder('tasks')
        .where('tasks.id = :id', { id })
        .andWhere({ user })
        .getOneOrFail();
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

  async updateStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ) {
    try {
      this.logger.debug(`This action update a #${id} status of Task`);
      const { status } = updateTaskStatusDto;
      await this.taskRespository
        .createQueryBuilder('tasks')
        .update(Task)
        .set({
          status: status,
        })
        .where('id = :id', { id })
        .andWhere({ user })
        .execute();
      return await this.findOne(id, user);
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

  async remove(id: string, user: User) {
    try {
      this.logger.debug(`This action removes a #${id} task`);
      await this.findOne(id, user);
      await this.taskRespository.delete(id);
      return { message: `remove task #${id} is success` };
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
