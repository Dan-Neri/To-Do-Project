/**
 * The AuthController handles incoming requests to ~api/auth/ for
 * user authenticated based requests. It the makes the appropriate call
 * to the AuthService provider.
 */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard, RequestWithUser } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDTO } from './sign-in.dto';
import { PwResetDTO } from './pw-reset.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    /*Take a username and password in the request body and return a
    a valid JWT. Throw an error if the username and password do not
    match a valid account.*/
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() DTO: SignInDTO) {
        return this.authService.signIn(DTO.username, DTO.password);
    }

    /*Decode an authenticated user's JWT from the request header and 
    return the contents. Throw an error if the JWT is invalid.*/
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req: RequestWithUser) {
        return req.user;
    }

    /*Send a password reset email to the account matching the email
    address in the request body. Throw an error if no matching account 
    is found.*/
    @Post('reset-email')
    sendResetEmail(@Body() DTO: { email: string }) {
        return this.authService.sendResetEmail(DTO.email);
    }
    
    /*Take a user id, new password, and JWT in the request body. Update
    the password of the matching user to the provided password. Throw
    an error if a matching user is not found or the JWT is invalid.*/
    @Post('pw-reset')
    resetPassword(@Body() DTO: PwResetDTO) {
        return this.authService.resetPassword(DTO);
    }
}
