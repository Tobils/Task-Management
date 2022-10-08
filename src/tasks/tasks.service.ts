import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRespository: Repository<Task>,
  ) {}

  private readonly logger: Logger = new Logger(TasksService.name);

  async create(createTaskDto: CreateTaskDto) {
    this.logger.debug('This action adds a new task');
    try {
      return await this.taskRespository.save(createTaskDto);
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
    try {
      this.logger.debug(`This action returns all tasks`);
      return await this.taskRespository.find();
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

  async findByFilter(filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto;
    return { filterDto };
  }

  async findOne(id: string) {
    try {
      this.logger.debug(`This action returns a #${id} task`);
      return await this.taskRespository
        .createQueryBuilder('tasks')
        .where('tasks.id = :id', { id })
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

  async updateStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto) {
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
        .execute();
      return await this.findOne(id);
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
    try {
      this.logger.debug(`This action removes a #${id} task`);
      await this.findOne(id);
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
