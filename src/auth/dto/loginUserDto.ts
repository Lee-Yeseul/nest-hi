import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './createUserDto';

export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}
