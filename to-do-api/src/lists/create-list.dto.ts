/**
 * A class declaration for the data transfer object that will be used to
 * pass information from the UI to the API when creating a new List.
 */
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml  from 'sanitize-html';
import { Project } from '../projects/project.entity';

export class CreateListDTO {
    @IsNotEmpty()
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    projectID: string;
    
    @IsNotEmpty()
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    title: string;
    
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    description?: string;
}