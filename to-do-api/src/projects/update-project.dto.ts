/**
 * A class declaration for the data transfer object that will be used to
 * pass project update information from the UI to the API.
 */
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml  from 'sanitize-html';

export class UpdateProjectDTO {
    @IsNotEmpty()
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    id: string;
    
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    title?: string;
    
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    description?: string;
}