/**
 * A class declaration for the data transfer object that will be used to
 * pass sign-in information from the UI to the API.
 */
import { IsNotEmpty } from 'class-validator';

export class SignInDTO {
    @IsNotEmpty()
    username: string;
    
    @IsNotEmpty()
    password: string;
}