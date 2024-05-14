/**
 * The FeatureService provides a method to create new features. It will
 * also contain methods to update and delete features in future 
 * releases.
 */
import { 
    Injectable, 
    ConflictException,
    Inject,
    BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feature } from './feature.entity';
import { CreateFeatureDTO } from './create-feature.dto';
import { ProjectsService } from '../projects/projects.service';

 
@Injectable()
export class FeaturesService {
    constructor(
        @InjectRepository(Feature)
        private featuresRepository: Repository<Feature>,
        private projectsService: ProjectsService,
    ) {}
    
    /*Take a userID and new project information. Create a corresponding 
    project Object, save that object in the database, and return it. 
    Throw an error if it is not possible to determine exactly where the 
    new feature should be created in the project workflow.*/
    async create(
        userID: string,
        DTO: CreateFeatureDTO
    ): Promise<Feature[]> {
        const project = await this.projectsService.findByID(
            userID, 
            DTO.projectID
        );
        if (!project) {
            throw new BadRequestException('Invalid project');
        }
        const list = project.lists.find((list) => list.id === DTO.listID);
        if (!list) {
            throw new BadRequestException('Invalid list');
        }
        
        const featureData = { 
            list: list, 
            title: DTO.title,
            description: DTO.description ?? undefined,
            position: list.features.length,
            userStories: []
        }
        const feature = this.featuresRepository.create(featureData);
        const newFeature = await this.featuresRepository.save(feature);
        
        list.features.push(newFeature);
        return list.features;
    }
    
    //Remove a feature with a matching id from the database.
    async remove(id: string): Promise<void> {
        await this.featuresRepository.delete(id);
    }
}
