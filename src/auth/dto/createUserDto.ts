import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '이메일', default: 'test@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '비밀번호', default: '12345678' })
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/, {
    message:
      'Password must contain at least one letter, one number, and be at least 8 characters long.',
  })
  password: string;

  @ApiProperty({ description: '비밀번호 확인', default: '12345678' })
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/, {
    message:
      'Password must contain at least one letter, one number, and be at least 8 characters long.',
  })
  confirmPassword: string;
}
