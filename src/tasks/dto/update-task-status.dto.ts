import { TaskStatus } from '../entities/task.entity';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
