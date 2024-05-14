/**
 * The AppModule is the root module of the API. It provides necessary
 * metadata for Nest to organize the application structure. It utilizes
 * TypeORM to facilitate communication with the database. It also 
 * provides a simple controller and provider, AppController and 
 * AppService, to handle direct requests made to http:/localhost/api.
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ProjectsModule } from './projects/projects.module';
import { ListsModule } from './lists/lists.module';
import { FeaturesModule } from './features/features.module';
import { UserStoriesModule } from './user-stories/user-stories.module';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [typeorm]
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (
                configService: ConfigService
            ): Promise<TypeOrmModuleOptions> => {
                const options = configService.get('typeorm')
                if (!options) {
                    throw new Error('TypeORM configuration was not found');
                }
                return options;
            }
        }),
        UsersModule,
        EmailModule,
        AuthModule,
        ProjectsModule,
        ListsModule,
        FeaturesModule,
        UserStoriesModule,
        TasksModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
