/**
 * The UserStoriesModule provides NestJS metadata for the UserStory
 * entity, controller, and service. It imports the ProjectModule so that
 * it can look up the project associated with each user story.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStoriesService } from './user-stories.service';
import { UserStoriesController } from './user-stories.controller';
import { ProjectsModule } from '../projects/projects.module';
import { UserStory } from '../user-stories/user-story.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserStory]),
        ProjectsModule
    ],
    providers: [UserStoriesService],
    controllers: [UserStoriesController],
    exports: [UserStoriesService]
})
export class UserStoriesModule {}
