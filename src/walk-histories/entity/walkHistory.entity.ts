import { User } from 'src/user/entity/user.entity';
import { Dog } from 'src/dogs/entity/dog.entity';
import { Place } from 'src/places/entity/place.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WalkHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  imagePath: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Place)
  place: Place;

  @Column({ nullable: true })
  placeId: number;

  // 날짜
  @Column()
  date: Date;

  @Column()
  oneLineComment: string;

  @ManyToOne(() => Dog)
  dog: Dog;

  @Column()
  dogId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
