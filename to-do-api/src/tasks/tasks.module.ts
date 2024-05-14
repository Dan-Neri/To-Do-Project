/**
 * The TasksModule provides NestJS metadata for the task entity,
 * controller, and service. It imports the ProjectsModule so that it can
 * look up the project associated with each task.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ProjectsModule } from '../projects/projects.module';
import { Task } from '../tasks/task.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task]),
        ProjectsModule
    ],
    providers: [TasksService],
    controllers: [TasksController],
    exports: [TasksService]
})
export class TasksModule {}
