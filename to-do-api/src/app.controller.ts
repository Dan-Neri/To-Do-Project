/**
 * The AppController listens for Get requests to the API and calls The
 * appropriate method from AppService to let the user know the API is
 * running.
 */
import { Controller, Get, Post, Param, Body} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDTO } from '../users/CreateUser.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getUsers(): string {
    return this.appService.getApp();
  }
}
