/**
 * The UsersModule provides NestJS metadata for the user entity,
 * controller, and service. It exports the UsersService to allow other 
 * modules to look up user account information.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule {}
