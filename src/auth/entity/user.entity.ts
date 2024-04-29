import { DogPost } from 'src/dog-posts/entity/dogPost.entity';
import { Dog } from 'src/dogs/entity/dog.entity';
import { PlaceHistory } from 'src/place-histories/entity/placeHistory.entity';
import { WalkHistory } from 'src/walk-histories/entity/walkHistory.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  localRefreshToken: string;

  @Column({ nullable: true })
  localRefreshTokenExp: Date;

  @Column({ nullable: true })
  profileImagePath: string;

  @Column({ type: 'numeric', scale: 6, nullable: true })
  registeredLatitude: number;

  @Column({ type: 'numeric', scale: 6, nullable: true })
  registeredLongitude: number;

  @OneToMany(() => Dog, (dog) => dog.owner)
  dogs: Dog[];

  @OneToMany(() => DogPost, (dogPost) => dogPost.author)
  dogPosts: DogPost[];

  @OneToMany(() => PlaceHistory, (placesHistory) => placesHistory.id)
  placesHistories: PlaceHistory[];

  @OneToMany(() => WalkHistory, (placesHistory) => placesHistory.id)
  walkHistories: WalkHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
