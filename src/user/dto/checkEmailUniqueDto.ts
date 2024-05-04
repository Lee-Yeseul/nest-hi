import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './createUserDto';

export class CheckEmailUniqueDto extends PickType(CreateUserDto, [
  'email',
] as const) {}
