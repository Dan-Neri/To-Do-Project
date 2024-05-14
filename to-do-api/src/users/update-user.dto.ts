/**
 * A class declaration for the data transfer object that will be used to
 * pass user update information from the UI to the API.
 */
import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml  from 'sanitize-html';
import { Project } from '../projects/project.entity';

export class UpdateUserDTO {
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    firstName?: string;
    
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    lastName?: string;
    
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    @IsOptional()
    @IsEmail()
    email?: string;
    
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    username?: string;
    
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    password?: string;
    
    projects?: Project[];
    
    projectCount?: number;
}