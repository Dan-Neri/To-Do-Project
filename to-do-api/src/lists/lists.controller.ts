/**
 * The ListsController handles incoming requests at ~/api/lists
 * and makes the appropriate calls to ListsService.
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
import { ListsService } from './lists.service';
import { List } from '../lists/list.entity';
import { AuthGuard, RequestWithUser } from '../auth/auth.guard';
import { CreateListDTO } from './create-list.dto'

@Controller('lists')
export class ListsController {
    constructor(private readonly listsService: ListsService) {}
    
    /*Take an access token in the request header and new list data in
    the body. Create and save a new list. Return a list of all lists
    associated with the same project.*/
    @UseGuards(AuthGuard)
    @Post('/create')
    create(
        @Request() req: RequestWithUser,
        @Body() DTO: CreateListDTO
    ): Promise<List[]> {
        return this.listsService.create(req.user.sub, DTO);
    }
}