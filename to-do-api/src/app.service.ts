/**
 * The AppService class provides one method getApp which returns a
 * string stating that the API is running. The helps ensure that the API
 * is working correctly.
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getApp(): string {
        return 'The API is running';
    }
}
