/**
 * The FeaturesModule provides NestJS metadata for the feature entity,
 * controller, and service. It imports the project module so that it can
 * look up associated projects.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';
import { ProjectsModule } from '../projects/projects.module';
import { Feature } from '../features/feature.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Feature]),
        ProjectsModule
    ],
    providers: [FeaturesService],
    controllers: [FeaturesController],
    exports: [FeaturesService]
})
export class FeaturesModule {}
