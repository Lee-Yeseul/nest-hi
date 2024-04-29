import { User } from 'src/auth/entity/user.entity';
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

  @Column()
  imagePath: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Place)
  place: Place;

  @Column()
  Date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
