/**
 * The ListsModule provides NestJS metadata for the list entity, 
 * controller, and service. It imports the projects module to look up
 * the project associated with each list.
 */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { ProjectsModule } from '../projects/projects.module';
import { List } from '../lists/list.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([List]),
        /*Since ProjectsModule also imports this module we must use a
        forwardRef to import each one and resolve the circular 
        dependency.*/
        forwardRef(() => ProjectsModule)
    ],
    providers: [ListsService],
    controllers: [ListsController],
    exports: [ListsService]
})
export class ListsModule {}
