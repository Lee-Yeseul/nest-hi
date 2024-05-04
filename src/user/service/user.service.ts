import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repository/user.repository';
import { UpdateUserInfoDto } from '../dto/updateUserInfoDto';
import { Not } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async updateUserInfo(updateUserInfo: UpdateUserInfoDto, userId: number) {
    const { username, profileImagePath } = updateUserInfo;
    const existedUsername = await this.userRepository.findOne({
      where: { username: username, id: Not(userId) },
    });

    if (existedUsername)
      throw new BadRequestException('Username is already in use');

    await this.userRepository.update(userId, {
      username,
      profileImagePath,
    });
  }
}
