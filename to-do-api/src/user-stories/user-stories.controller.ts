/**
 * The UserStoriesController handles incoming requests at 
 * ~/api/user-stories and makes the appropriate calls to 
 * UserStoriesService.
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
import { UserStoriesService } from './user-stories.service';
import { UserStory } from './user-story.entity';
import { AuthGuard, RequestWithUser } from '../auth/auth.guard';
import { CreateUserStoryDTO } from './create-user-story.dto';
import { UpdateUserStoryDTO } from './update-user-story.dto';

@Controller('user-stories')
export class UserStoriesController {
    constructor(private readonly userStoriesService: UserStoriesService) {}
    
    /*Take an access token in the request header and a DTO containing
    new user story information in the body. Create and save a new user
    story object from the DTO information. Return a list of all the 
    user stories associated with the same feature.*/
    @UseGuards(AuthGuard)
    @Post('/create')
    create(
        @Request() req: RequestWithUser,
        @Body() DTO: CreateUserStoryDTO 
    ): Promise<UserStory[]> {
        return this.userStoriesService.create(req.user.sub, DTO);
    }
    
    /*Take an access token in the request header and a DTO containing
    user story update information in the body. Update the specified
    information in the given user story.*/
    @UseGuards(AuthGuard)
    @Post('/update')
    update(
        @Request() req: RequestWithUser,
        @Body() DTO: UpdateUserStoryDTO
    ): Promise<UserStory> {
        return this.userStoriesService.update(req.user.sub, DTO);
    }
}