/**
 * The UsersController handles incoming requests at api/user and makes 
 * the appropriate calls to usersService.
 */
import { Controller, Get, Post, Param, Body} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from '../users/CreateUser.dto';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  /*Listens for a Get request and returns all the users currently in the 
  database*/
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
  
  //Listens for a Post request and calls the service to create a new user
  @Post('create')
  create(@Body() createUserDTO: Partial<User>): Promise<User> {
    return this.usersService.create(createUserDTO);
  }
}