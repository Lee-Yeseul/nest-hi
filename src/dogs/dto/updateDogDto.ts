import { PartialType } from '@nestjs/swagger';
import { CreateDogDto } from './createDogDto';

export class UpdateDogDto extends PartialType(CreateDogDto) {}
