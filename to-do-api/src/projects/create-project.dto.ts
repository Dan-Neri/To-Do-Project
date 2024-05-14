/**
 * A class declaration for the data transfer object that will be used to
 * pass information from the UI to the API when creating a new Project.
 */
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml  from 'sanitize-html';
import { User } from '../users/user.entity';
import { List } from '../lists/list.entity';

export class CreateProjectDTO {
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