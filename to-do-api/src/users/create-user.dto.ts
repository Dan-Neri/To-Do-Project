/**
 * A class declaration for the data transfer object that will be used to
 * pass user information from the UI to the API when creating a new user.
 */
import { IsNotEmpty, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml  from 'sanitize-html';

export class CreateUserDTO {
    @IsNotEmpty()
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    firstName: string;
    
    @IsNotEmpty()
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    lastName: string;
    
    @IsNotEmpty()
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    username: string;
    
    @IsNotEmpty()
    @Transform((params) => sanitizeHtml(params.value, { 
        allowedTags: [], 
        allowedAttributes: {}
    }))
    password: string;
}