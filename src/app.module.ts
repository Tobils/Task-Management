import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { UserModule } from './user/user.module';
import { TypeOrmModuleOptions, TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/jwt.guard';

const typeOrmModuleOption: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 54321,
  username: 'dG9iaWw',
  password: 'YXc1cWRYUT0',
  database: 'Z2F0ZXdheQ',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmModuleOption),
    TasksModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
