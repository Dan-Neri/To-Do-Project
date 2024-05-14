/**
 * The ProjectsService provides methods to create and retrieve projects
 * from a specified user account. It will also provide methods to update
 * and delete existing projects in future releases.
 */
import { 
    Injectable, 
    ConflictException,
    Inject,
    BadRequestException,
    forwardRef
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../users/user.entity';
import { List } from '../lists/list.entity';
import { UsersService } from '../users/users.service';
import { ListsService } from '../lists/lists.service';
import { CreateProjectDTO } from './create-project.dto';
 
@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
        @Inject(forwardRef(() => ListsService))
        private listsService: ListsService,
        private usersService: UsersService
    ) {}

    //Return all projects associated with the given user account.
    async getProjects(userID: string): Promise<Project[] | null> {
        return await this.projectsRepository.find({
            where: { user: { id: userID }}
        });
    }

    //Return a project with a matching id from the database.
    async findByID(
        userID: string, 
        projectID: string
    ): Promise<Project> {
        const project = await this.projectsRepository.findOne({
            where: { user: { id: userID }, id: projectID },
            relations: [
                'lists', 
                'lists.features', 
                'lists.features.userStories', 
                'lists.features.userStories.tasks'
            ]
        });
        if (!project) {
            throw new BadRequestException('Project Not Found');
        }
        return project;
    }
    
    /*Take a userID and new project information. Create a corresponding 
    project Object, save that object in the database, and return it. 
    Throw an error if a matching userAccount is not found.*/
    async create(
        userID: string, 
        DTO: CreateProjectDTO
    ): Promise<Project> {
        const user = await this.usersService.findById(userID);
        const projectData = { 
            user: user,
            title: DTO.title,
            description: DTO.description ?? undefined
        };
        const project = this.projectsRepository.create(projectData);
        const newProject = await this.projectsRepository.save(project);
        //Create a default To Do list in every new project.
        const listData = { projectID: newProject.id, title:'To Do' };
        await this.listsService.create(userID, listData);
        await this.usersService.update(
            userID, 
            {projectCount: (user.projectCount || 0) + 1}
        );
        
        return project;
    }
    
    //Remove a project with a matching id from the database.
    async remove(id: string): Promise<void> {
        await this.projectsRepository.delete(id);
    }
}
