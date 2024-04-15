/**
 * The UsersController handles incoming requests at ~/api/user and makes 
 * the appropriate calls to usersService.
 */
import { 
    Controller, 
    Get, 
    Post, 
    Param, 
    Body, 
    UseGuards,
    Request,
    BadRequestException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './create-user.dto';
import { UpdateUserDTO } from './update-user.dto';
import { GetUserDTO } from './get-user.dto';
import { User } from './user.entity';
import { AuthGuard, RequestWithUser } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    /*Take a user id in the request header and return the matching 
    account information. Throw an error if a matching user is not found
    or the JWT is invalid.*/
    @UseGuards(AuthGuard)
    @Get('account')
    getAccount(
        @Request() req: RequestWithUser
    ): Promise<Partial<User> | null> {
        return this.usersService.getAccount(req.user.sub);
    }
    
    /*Take new user information in the request body. Create a new user
    object from this information and store it in the database. Return
    the resultant user object. Throw an error if a user already exists
    with the given username or email address.*/
    @Post('create')
    create(@Body() body: CreateUserDTO): Promise<Partial<User>> {
        return this.usersService.create(body);
    }
    
    /*Take new user information in the request body along with a user id
    and JWT in the request header. Update the specified informaiton in
    the matching user's account and return a user object with the
    updated information. Throw an error if a matching user is not found,
    the JWT is invalid, or the given email address or username is
    already taken.*/
    @UseGuards(AuthGuard)
    @Post('update')
    update(
        @Request() req: RequestWithUser, 
        @Body() body: UpdateUserDTO
    ): Promise<Partial<User>> {
        return this.usersService.update(req.user.sub, body);
    }
}