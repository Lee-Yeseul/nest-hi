import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repository/user.repository';
import { UserFollowersRepository } from '../repository/userFollowers.repository';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(UserFollowersRepository)
    private readonly userFollowersRepository: UserFollowersRepository,
  ) {}

  async followUser(followeeId: number, followerId: number) {
    const result = await this.userFollowersRepository.save({
      follower: { id: followerId },
      followee: { id: followeeId },
    });
    return result;
  }

  async getFollowers(userId: number) {
    const result = await this.userFollowersRepository.find({
      where: {
        followee: { id: userId },
        isConfirmed: true,
      },
      relations: { follower: true, followee: true },
    });

    return result.map((x) => x.follower); // follower만 뽑아서 리스트만들기
  }

  async confirmFollow(followerId: number, followeeId: number) {
    const follow = await this.userFollowersRepository.findOne({
      where: { follower: { id: followerId }, followee: { id: followeeId } },
      relations: { follower: true, followee: true },
    });

    if (!follow) throw new NotFoundException('not existing follow');

    await this.userFollowersRepository.update(follow.id, { isConfirmed: true });
    return true;
  }

  async deleteFollow(followerId: number, followeeId: number) {
    const follow = await this.userFollowersRepository.findOne({
      where: { follower: { id: followerId }, followee: { id: followeeId } },
    });

    if (!follow) throw new NotFoundException('not existing follow');

    await this.userFollowersRepository.delete(follow.id);
    return true;
  }
}
