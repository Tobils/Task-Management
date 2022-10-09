import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  ManyToOne,
} from 'typeorm';

import { Exclude } from 'class-transformer';

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@Entity()
@Unique(['title'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.task, { eager: false })
  @Exclude({
    toPlainOnly: true,
  }) /** whenever return plain text or json response, it will be excluded */
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  deletedAt: Date;
}
