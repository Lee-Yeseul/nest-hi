import { PickType } from '@nestjs/swagger';
import { UpdateUserInfoDto } from './updateUserInfoDto';

export class CheckUsernameUniqueDto extends PickType(UpdateUserInfoDto, [
  'username',
] as const) {}
