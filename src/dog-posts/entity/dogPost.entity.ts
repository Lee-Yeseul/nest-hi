import { User } from 'src/auth/entity/user.entity';
import { Dog } from 'src/dogs/entity/dog.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class DogPost extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.dogPosts)
  author: User;

  @Column()
  authorId: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column('text', { array: true, nullable: true })
  tags?: string[];

  @Column({ nullable: true })
  primaryActivityZone?: string;

  @ManyToOne(() => Dog)
  Dog: Dog;

  @Column()
  dogId: number;
}
