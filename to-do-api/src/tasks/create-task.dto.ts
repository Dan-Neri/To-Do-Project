/**
 * A class declaration for the data transfer object that will be used to
 * pass information from the UI to the API when creating a new Task.
 */
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml  from 'sanitize-html';

export class CreateTaskDTO {
    _id?: string;
    
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
    listID: string;
    
    @IsNotEmpty()
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    featureID: string;
    
    @IsNotEmpty()
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    userStoryID: string;
    
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    content?: string;
    
    completed?: boolean;
}