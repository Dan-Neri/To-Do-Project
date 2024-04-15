/**
 * The AuthModule provides NestJs configuration details for the
 * AuthController and AuthService. It imports the UserModule to lookup
 * accounts and the Email Module to send password reset emails.
 */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '@nestjs/jwt';
import GetENV from '../getENV';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: GetENV('JWT_SECRET'),
            signOptions: { expiresIn: '60s' }
        }),
        UsersModule,
        EmailModule
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})

export class AuthModule {}
