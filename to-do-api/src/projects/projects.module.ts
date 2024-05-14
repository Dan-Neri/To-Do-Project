/**
 * The ProjectsModule provides NestJS metadata details for the Project
 * entity, controller, and service. It imports UsersModule to look up
 * user account associated with each project. I also imports ListsModule
 * so that it can create default 'To do' list in each new project.
 */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UsersModule } from '../users/users.module';
import { ListsModule } from '../lists/lists.module';
import { Project } from './project.entity';
import { Feature } from '../features/feature.entity';
import { UserStory } from '../user-stories/user-story.entity';
import { Task } from '../tasks/task.entity';
import { List } from '../lists/list.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([Project]),
        /*Since ListsModule also imports this module we must use a
        forwardRef to import each one and resolve the circular 
        dependency.*/
        forwardRef(() => ListsModule),
        UsersModule
    ],
    providers: [ProjectsService],
    controllers: [ProjectsController],
    exports: [ProjectsService]
})
export class ProjectsModule {}
