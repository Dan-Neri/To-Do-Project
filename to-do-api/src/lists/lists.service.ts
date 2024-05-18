/**
 * The ListsService provides a method to create a new list in the
 * associated project. It will also contain methods to update and delete
 * existing lists in future releases.
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
import { List } from '../lists/list.entity';
import { ProjectsService } from '../projects/projects.service';
import { CreateListDTO } from './create-list.dto';
import { UpdateListDTO } from './update-list.dto';
 
@Injectable()
export class ListsService {
    constructor(
        @InjectRepository(List)
        private listsRepository: Repository<List>,
        @Inject(forwardRef(() => ProjectsService))
        private projectsService: ProjectsService
    ) {}
    
    /*Take a userID and an object containing the new list data. Create a
    new list object from the data, save that object in the database, and
    return a list of all lists in the associated project. Throw an
    error if a matching project is not found.*/
    async create(
        userID: string, 
        DTO: CreateListDTO
    ): Promise<List[]> {
        const project = await this.projectsService.findByID(
            userID, 
            DTO.projectID
        );
        if (!project) {
            throw new BadRequestException('Invalid project');
        }
        const listData = { 
            project: project, 
            title: DTO.title,
            description: DTO.description ?? undefined,
            position: project.lists.length,
            features: []
        }
        const list = this.listsRepository.create(listData);
        const newList = await this.listsRepository.save(list);
        
        project.lists.push(newList);
        return project.lists;
    }
  
    /*Take a userID and list update data. Change the specified 
    information for the given list and return it. Throw an error if a 
    matching list cannot be found.*/
    async update(
        userID: string, 
        DTO: UpdateListDTO
    ): Promise<List> {
        const project = await this.projectsService.findByID(
            userID, 
            DTO.projectID
        );
        const list = project.lists.find((list) => list.id === DTO.id);
        if (!list) {
            throw new BadRequestException('Invalid list');
        }
        list.title = DTO.title ?? list.title;
        list.position = DTO.position ?? list.position;
        list.features = DTO.features ?? list.features;
        
        const newList = await this.listsRepository.save(list);
        
        return newList;
    }
    
    //Remove a list with a matching id from the database.
    async remove(id: string): Promise<void> {
        await this.listsRepository.delete(id);
    }
}
