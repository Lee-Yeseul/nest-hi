import { Injectable } from '@nestjs/common';
import { UserFollowers } from '../entity/userFollowers.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserFollowersRepository extends Repository<UserFollowers> {
  constructor(private dataSourse: DataSource) {
    super(UserFollowers, dataSourse.createEntityManager());
  }
}
