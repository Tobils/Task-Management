import { TasksController } from './tasks.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import * as httpMock from 'node-mocks-http';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { User } from 'src/user/entities/user.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let user;

  function getParamDecoratorFactory(decorator: Function) {
    class TestDecorator {
      public test(@GetUser() value) {}
    }

    const args = Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      TestDecorator,
      'test',
    );
    return args[Object.keys(args)[0]].factory;
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        { provide: APP_PIPE, useValue: new ValidationPipe() },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  describe('decorator', () => {
    it('Decorator Test', () => {
      const req = httpMock.createRequest();
      const res = httpMock.createResponse();
      const mockUser = { userId: 1, username: 'john' };
      req.user = mockUser;
      const ctx = new ExecutionContextHost([req, res]);
      const factory = getParamDecoratorFactory(User);
      const user = getParamDecoratorFactory(null);
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });
});
