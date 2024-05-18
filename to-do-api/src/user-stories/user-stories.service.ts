/**
 * The UsersStoriesService provides a method for creating a new user
 * story. It will also provide methods for updating and deleting
 * existing user stories in future releases.
 */
import { 
    Injectable, 
    ConflictException,
    Inject,
    BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStory } from './user-story.entity';
import { ProjectsService } from '../projects/projects.service';
import { CreateUserStoryDTO } from './create-user-story.dto';
import { UpdateUserStoryDTO } from './update-user-story.dto';
 
@Injectable()
export class UserStoriesService {
    constructor(
        @InjectRepository(UserStory)
        private userStoriesRepository: Repository<UserStory>,
        private projectsService: ProjectsService,
    ) {}
    
    /*Take a userID and new user story data. Create a corresponding 
    user story object and save that object in the database. Return a
    list of all user stories associated with the same feature. Throw an
    error if it is not possible to determine exactly where the new user
    story should be created in the project workflow.*/
    async create(
        userID: string, 
        DTO: CreateUserStoryDTO
    ): Promise<UserStory[]> {
        const project = await this.projectsService.findByID(
            userID, 
            DTO.projectID
        );
        const list = project.lists.find((list) => list.id === DTO.listID);
        if (!list) {
            throw new BadRequestException('Invalid list');
        }
        const feature = list.features.find(
            (feature) => feature.id === DTO.featureID
        );
        if (!feature) {
            throw new BadRequestException('Invalid feature');
        }
        const storyData = { 
            feature: feature, 
            title: DTO.title,
            description: DTO.description ?? undefined,
            tasks: []
        }
        const userStory = this.userStoriesRepository.create(storyData);
        const newUserStory = await this.userStoriesRepository.save(userStory);
        
        feature.userStories.push(newUserStory);
        return feature.userStories;
    }
    
    /*Take a userID and user story update data. Change the specified 
    data for the given user story and return it. Throw an error if a 
    matching task cannot be found.*/
    async update(
        userID: string, 
        DTO: UpdateUserStoryDTO
    ): Promise<UserStory> {
        const project = await this.projectsService.findByID(
            userID, 
            DTO.projectID
        );
        const list = project.lists.find((list) => list.id === DTO.listID);
        if (!list) {
            throw new BadRequestException('Invalid list');
        }
        const feature = list.features.find(
        (feature) => feature.id === DTO.featureID
        );
        if (!feature) {
            throw new BadRequestException('Invalid feature');
        }
        const userStory = feature.userStories.find(
            (userStory) => userStory.id === DTO.id
        );
        if (!userStory) {
            throw new BadRequestException('Invalid user story');
        }
        userStory.title = DTO.title ?? userStory.title;
        userStory.description = DTO.description ?? userStory.description;
        userStory.tasks = DTO.tasks ?? userStory.tasks;
        
        const newStory = await this.userStoriesRepository.save(userStory);
        
        return newStory;
    }
    
    //Remove a project with a matching id from the database.
    async remove(id: string): Promise<void> {
        await this.userStoriesRepository.delete(id);
    }
}
