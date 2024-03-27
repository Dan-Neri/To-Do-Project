/**
 * The AppService class provides one method getApp which returns a
 * string stating that the API is running.
 */
import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../users/CreateUser.dto';

@Injectable()
export class AppService {
    getApp(): string {
        return 'The API is running';
    }
}
