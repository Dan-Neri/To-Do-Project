/**
 * The UsersModule provides NestJS configuration details for all
 * database entities at this point. In future updates there will be
 * a separate module for at least the Project entity and maybe others.
 * The UsersModule also houses the UsersController and UsersService.
 * It exports the UsersService to allow other modules to look up user
 * and account information.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Project } from '../project/project.entity';
import { Feature } from '../feature/feature.entity';
import { UserStory } from '../user-story/userStory.entity';
import { Task } from '../task/task.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User, 
            Project, 
            Feature, 
            UserStory, 
            Task
        ]), 
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule {}
