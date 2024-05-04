import { PartialType } from '@nestjs/swagger';
import { CreateDogPostDto } from './createDogPostDto';

export class UpdateDogPostDto extends PartialType(CreateDogPostDto) {}
