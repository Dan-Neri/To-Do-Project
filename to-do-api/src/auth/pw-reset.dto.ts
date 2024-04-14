/**
 * A class declaration for the data transfer object that will be used to
 * pass password reset information from the UI to the API.
 */
import { IsNotEmpty } from 'class-validator';

export class PwResetDTO {
    @IsNotEmpty()
    token: string;
    
    @IsNotEmpty()
    userID: number;
    
    @IsNotEmpty()
    password: string;
}