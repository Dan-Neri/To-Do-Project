/**
 * The TasksService provides methods to create, update and delete tasks
 * from a specified project workflow.
 */
import { 
    Injectable, 
    ConflictException,
    Inject,
    BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { ProjectsService } from '../projects/projects.service';
import { CreateTaskDTO } from './create-task.dto';
import { UpdateTaskDTO } from './update-task.dto';
 
@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        private projectsService: ProjectsService,
    ) {}
    
    /*Take a userID and new Task data. Create a corresponding task 
    object and save it in the database. Return a list of all tasks
    associated with the same user story. Throw an error if it is not
    possible to determine exactly where the new task should be created
    in the project workflow.*/
    async create(
        userID: string, 
        DTO: CreateTaskDTO
    ): Promise<Task[]> {
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
            (userStory) => userStory.id === DTO.userStoryID
        );
        if (!userStory) {
            throw new BadRequestException('Invalid user story');
        }
        const taskData = { 
            userStory: userStory, 
            content: DTO.content,
            completed: false
        }
        const task = this.tasksRepository.create(taskData);
        const newTask = await this.tasksRepository.save(task);
        
        userStory.tasks.push(newTask);
        return userStory.tasks;
    }
    
    /*Take a userID and task update data. Change the specified data for
    the given task and return it. Throw an error if a matching task
    cannot be found.*/
    async update(
        userID: string, 
        DTO: UpdateTaskDTO
    ): Promise<Task> {
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
            (userStory) => userStory.id === DTO.userStoryID
        );
        if (!userStory) {
            throw new BadRequestException('Invalid user story');
        }
        const task = userStory.tasks.find(task => task.id === DTO.id);
        if (!task) {
            throw new BadRequestException('Invalid task');
        }
        task.content = DTO.content ?? task.content;
        task.completed = DTO.completed ?? task.completed;
        
        const newTask = await this.tasksRepository.save(task);
        
        return newTask;
    }
    
    //Remove a task with a matching id from the database.
    async remove(id: string): Promise<void> {
        await this.tasksRepository.delete(id);
    }
}
