import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import GetENV from '../src/getENV';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: GetENV('JWT_SECRET'),
            signOptions: { expiresIn: '60s' }
        }),
        UsersModule
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})

export class AuthModule {}
