/**
 * A class declaration for the data transfer object that will be used to
 * pass user information from the UI to the API when creating a new user.
 */
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDTO {
    _id?: number;
    
    @IsNotEmpty()
    firstName: string;
    
    @IsNotEmpty()
    lastName: string;
    
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    username: string;
    
    @IsNotEmpty()
    password: string;
    
    isActive?: boolean;
}