/**
 * The ProjectsController handles incoming requests at ~/api/projects
 * and makes the appropriate calls to ProjectsService.
 */
import { 
    Controller, 
    Get, 
    Post, 
    Param, 
    Body, 
    UseGuards,
    Request,
    BadRequestException,
    UsePipes
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { List } from '../lists/list.entity';
import { AuthGuard, RequestWithUser } from '../auth/auth.guard';
import { CreateProjectDTO } from './create-project.dto';
import { UpdateProjectDTO } from './update-project.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}
    
    /*Take an access token in the request header and return a list of 
    all projects associated with that account.*/
    @UseGuards(AuthGuard)
    @Get()
    getProjects(
        @Request() req: RequestWithUser
    ): Promise<Project[] | null> {
        return this.projectsService.getProjects(req.user.sub);
    }

    /*Take an access token in the request header and a project id in the
    request URL. Return a matching project from that user's account.
    Throw an error if there is no matching project in this user's
    account.*/
    @UseGuards(AuthGuard)
    @Get(':id')
    findByID(
        @Request() req: RequestWithUser, 
        @Param('id') id: string
    ): Promise<Project> {
        return this.projectsService.findByID(req.user.sub, id);
    }
    
    /*Take an access token in the request header and new project 
    information in the request body. Create a new project with the 
    specified information and associate it with the matching user's 
    account. Return the resulting project object. Throw an error if a 
    matching user is not found or the JWT is invalid.*/
    @UseGuards(AuthGuard)
    @Post('create')
    create(
        @Request() req: RequestWithUser, 
        @Body() DTO: CreateProjectDTO
    ): Promise<Project> {
        return this.projectsService.create(req.user.sub, DTO);
    }
    
    /*Take an access token in the request header and a DTO containing
    project update data in the body. Update the specified information in 
    the given project.*/
    @UseGuards(AuthGuard)
    @Post('/update')
    update(
        @Request() req: RequestWithUser,
        @Body() DTO: UpdateProjectDTO
    ): Promise<Project> {
        return this.projectsService.update(req.user.sub, DTO);
    }
    
    /*
    @Post('delete')
    create(@Body() body: ): Promise<Partial<User>> {
        return this.usersService.create(body);
    }
    
    /*Take new user information in the request body along with a user id
    and JWT in the request header. Update the specified informaiton in
    the matching user's account and return a user object with the
    updated information. Throw an error if a matching user is not found,
    the JWT is invalid, or the given email address or username is
    already taken.
    @UseGuards(AuthGuard)
    @Post('update')
    update(
        @Request() req: RequestWithUser, 
        @Body() body: UpdateUserDTO
    ): Promise<Partial<User>> {
        return this.usersService.update(req.user.sub, body);
    }*/
}