/**
 * The TasksController handles incoming requests at ~/api/tasks
 * and makes the appropriate calls to TasksService.
 */
import { 
    Controller, 
    Get, 
    Post, 
    Param, 
    Body, 
    UseGuards,
    Request,
    BadRequestException
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { AuthGuard, RequestWithUser } from '../auth/auth.guard';
import { CreateTaskDTO } from './create-task.dto';
import { UpdateTaskDTO } from './update-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
    
    /*Take an access token in the request header and a DTO containing
    new task information in the body. Create and save a new task object
    from the DTO information. Return a list of all the tasks associated
    with the same user story.*/
    @UseGuards(AuthGuard)
    @Post('/create')
    create(
        @Request() req: RequestWithUser,
        @Body() DTO: CreateTaskDTO 
    ): Promise<Task[]> {
        return this.tasksService.create(req.user.sub, DTO);
    }
    
    /*Take an access token in the request header and a DTO containing
    task update information in the body. Update the specified
    information in the given task.*/
    @UseGuards(AuthGuard)
    @Post('/update')
    update(
        @Request() req: RequestWithUser,
        @Body() DTO: UpdateTaskDTO
    ): Promise<Task> {
        return this.tasksService.update(req.user.sub, DTO);
    }
}