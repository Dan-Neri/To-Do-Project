/**
 * A class declaration for the data transfer object that will be used to
 * pass user update information from the UI to the API. It extends
 * CreateUserDTO and makes all fields optional.
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}