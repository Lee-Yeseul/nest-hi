import { PlaceHistory } from 'src/place-histories/entity/placeHistory.entity';
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
  profileImage: string;

  @Column({ type: 'numeric', scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'numeric', scale: 6, nullable: true })
  longitude: number;

  @OneToMany(() => PlaceHistory, (placesHistory) => placesHistory.id)
  placesHistories: PlaceHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
