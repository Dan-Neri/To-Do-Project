/**
 * The AppModule is the root module of the API. It provides necessary
 * metadata for Nest to organize the application structure. It imports
 * the TypeORMModule to facilitate communication with the database. It
 * also imports all other modules across the API along with a simple
 * controller and provider, AppController and AppService, to handle
 * direct request to the API.
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import * as dotenv from 'dotenv';

dotenv.config()

//Load from the .env file
const DB_HOST: string = getENV('DB_HOST');
const DB_PORT: number = Number(getENV('DB_PORT'));
const DB_USER: string = getENV('DB_USERNAME');
const DB_PASS: string = getENV('DB_PASSWORD');
const DB_NAME: string = getENV('DB_NAME');

/*
    Check to make sure the specified environmental variable exists in 
    the .env file and throw an exception otherwise.
*/
function getENV(key: string): string {
    if (process.env[key] === undefined) {
        throw ReferenceError(`Environmental variable missing: ${key}`);
    }
    return process.env[key] as string;
}

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USER,
            password: DB_PASS,
            database: DB_NAME,
            autoLoadEntities: true,
        }),
        //Responsible for handling all user requests at api/users/
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
