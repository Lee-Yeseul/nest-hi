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
    if (followeeId === followerId)
      throw new NotFoundException('cannot follow yourself');
    const follow = await this.userFollowersRepository.findOne({
      where: { follower: { id: followerId }, followee: { id: followeeId } },
    });
    if (follow) throw new NotFoundException('already following');

    const result = await this.userFollowersRepository.save({
      follower: { id: followerId },
      followee: { id: followeeId },
    });
    return { id: result.id };
  }

  async getMutualFollowers(userId: number) {
    const result = await this.userFollowersRepository.find({
      where: {
        followee: { id: userId },
        isConfirmed: true,
      },
      relations: { follower: true, followee: true },
    });

    return result.map((x) => {
      const { id, username, profileImagePath } = x.follower;
      return { id, username, profileImagePath };
    });
  }

  async getFollowers(userId: number) {
    console.log(userId);
    const result = await this.userFollowersRepository.find({
      where: {
        followee: { id: userId },
      },

      relations: { follower: true, followee: true },
    });

    return result.map((x) => {
      const { id, username, profileImagePath } = x.follower;
      return { id, username, profileImagePath };
    });
  }
  async getFollowees(userId: number) {
    const result = await this.userFollowersRepository.find({
      where: {
        follower: { id: userId },
      },
      relations: { follower: true, followee: true },
    });

    return result.map((x) => {
      const { id, username, profileImagePath } = x.follower;
      return { id, username, profileImagePath };
    });
  }

  async confirmFollow(followerId: number, followeeId: number) {
    const follow = await this.userFollowersRepository.findOne({
      where: { follower: { id: followerId }, followee: { id: followeeId } },
      relations: { follower: true, followee: true },
    });

    if (!follow) throw new NotFoundException('not existing follow');

    await this.userFollowersRepository.update(follow.id, { isConfirmed: true });
  }

  async deleteFollow(followerId: number, followeeId: number) {
    const follow = await this.userFollowersRepository.findOne({
      where: { follower: { id: followerId }, followee: { id: followeeId } },
    });

    if (!follow) throw new NotFoundException('not existing follow');

    await this.userFollowersRepository.delete(follow.id);
  }
}
