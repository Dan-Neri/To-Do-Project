/**
 * The FeatureController handles incoming requests at ~/api/features/
 * and makes the appropriate calls to FeaturesService.
 */
import { 
    Controller, 
    Get, 
    Post, 
    Param, 
    Body, 
    UseGuards,
    Request,
    BadRequestException
} from '@nestjs/common';
import { FeaturesService } from './features.service';
import { Feature } from './feature.entity';
import { CreateFeatureDTO } from './create-feature.dto';
import { AuthGuard, RequestWithUser } from '../auth/auth.guard';
import { UpdateFeatureDTO } from './update-feature.dto';

@Controller('features')
export class FeaturesController {
    constructor(private readonly featuresService: FeaturesService) {}
    
    /*Take an access token in the request header and a DTO containing
    new feature information in the body. Create and save a new feature
    from the DTO information. Return a list of all the features
    associated with the same list.
    */
    @UseGuards(AuthGuard)
    @Post('/create')
    create(
        @Request() req: RequestWithUser,
        @Body() DTO: CreateFeatureDTO 
    ): Promise<Feature[]> {
        return this.featuresService.create(req.user.sub, DTO);
    }
    
    /*Take an access token in the request header and a DTO containing
    feature update information in the body. Update the specified
    information in the given feature.*/
    @UseGuards(AuthGuard)
    @Post('/update')
    update(
        @Request() req: RequestWithUser,
        @Body() DTO: UpdateFeatureDTO
    ): Promise<Feature> {
        return this.featuresService.update(req.user.sub, DTO);
    }
}