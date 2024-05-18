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
import { UpdateFeatureDTO } from './update-feature.dto';
 
@Injectable()
export class FeaturesService {
    constructor(
        @InjectRepository(Feature)
        private featuresRepository: Repository<Feature>,
        private projectsService: ProjectsService,
    ) {}
    
    /*Take a userID and new feature data. Create a corresponding feature 
    object, save that object in the database, and return it. 
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
    
    /*Take a userID and feature update data. Change the specified data 
    for the given feature and return it. Throw an error if a matching 
    feature cannot be found.*/
    async update(
        userID: string, 
        DTO: UpdateFeatureDTO
    ): Promise<Feature> {
        const project = await this.projectsService.findByID(
            userID, 
            DTO.projectID
        );
        const list = project.lists.find((list) => list.id === DTO.listID);
        if (!list) {
            throw new BadRequestException('Invalid list');
        }
        const feature = list.features.find(
        (feature) => feature.id === DTO.id
        );
        if (!feature) {
            throw new BadRequestException('Invalid feature');
        }
        feature.title = DTO.title ?? feature.title;
        feature.description = DTO.description ?? feature.description;
        feature.position = DTO.position ?? feature.position;
        feature.userStories = DTO.userStories ?? feature.userStories;
        
        const newFeature = await this.featuresRepository.save(feature);
        
        return newFeature;
    }
    
    //Remove a feature with a matching id from the database.
    async remove(id: string): Promise<void> {
        await this.featuresRepository.delete(id);
    }
}
