/**
 * The UsersController handles incoming requests at api/user and makes 
 * the appropriate calls to usersService.
 */
import { 
    Controller, 
    Get, 
    Post, 
    Param, 
    Body, 
    UseGuards 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from '../users/CreateUser.dto';
import { GetUserDTO } from '../users/GetUser.dto';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    /*Listen for a Get request and return User information if authenticated
    @UseGuards(AuthGuard)
    @Get()
    getUser(): Promise<string> {
        return this.usersService.hashPass('encrypt', 10);
    }/*
    
    /*Listen for a Post request, check to make sure that the username is 
    not in use, and call the service to create a new user.*/
    @Post('create')
    create(@Body() createUserDTO: CreateUserDTO): Promise<User> {
        return this.usersService.create(createUserDTO);
    }
}