import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import express from 'express';

@Controller('/api/users')
export class UserController {
  @Get('/sample')
  get(): string {
    return 'Get Users';
  }

  @Get('/hello')
  sayHello(@Query('first_name') firstname: string,
@Query('last_name') lastName: string): string {
    return `Hello, ${firstname} ${lastName}!`;
  }

    @Get('/:id')
  getById(@Req() request: express.Request): string {
    return `Get ${request.params.id}`;
  }

  @Post()
  post(): string {
    return 'Hello World';
  }
}
