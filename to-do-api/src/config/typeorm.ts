/**
 * This file utilizes the getENV method to load enviroment variables 
 * from the .env file and stores them in an object which is then
 * provided to typeORM to use as configuration options when connecting
 * to the database.
 */

import { registerAs } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import GetENV from '../getENV';

//Load from the .env file
const DB_HOST: string = GetENV('DB_HOST');
const DB_PORT: number = Number(GetENV('DB_PORT'));
const DB_USER: string = GetENV('DB_USERNAME');
const DB_PASS: string = GetENV('DB_PASSWORD');
const DB_NAME: string = GetENV('DB_NAME');

const config = {
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: false
}

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
