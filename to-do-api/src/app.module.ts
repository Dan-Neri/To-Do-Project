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
import { Password } from '../users/password.entity';
import { UsersModule } from '../users/users.module';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import GetENV from './getENV';

//Load from the .env file
const DB_HOST: string = GetENV('DB_HOST');
const DB_PORT: number = Number(GetENV('DB_PORT'));
const DB_USER: string = GetENV('DB_USERNAME');
const DB_PASS: string = GetENV('DB_PASSWORD');
const DB_NAME: string = GetENV('DB_NAME');

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USER,
            password: DB_PASS,
            database: DB_NAME,
            entities: [User],
            synchronize: true
        }),
        //Responsible for handling all user requests at api/users/
        UsersModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
