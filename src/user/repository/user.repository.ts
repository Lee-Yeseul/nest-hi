import { DataSource, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/createUserDto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSourse: DataSource) {
    super(User, dataSourse.createEntityManager());
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, confirmPassword, username } = createUserDto;

    if (password !== confirmPassword)
      throw new BadRequestException('Passwords do not match');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ email, password: hashedPassword, username });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(error.detail);
      }
      throw new InternalServerErrorException();
    }
  }
}
