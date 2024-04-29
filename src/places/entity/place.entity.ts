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
export class Place extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  addressName: string;

  //   enum으로 변경하기
  @Column()
  category: string;

  @OneToMany(() => PlaceHistory, (history) => history.id)
  publicHistories: PlaceHistory[];

  get publicReviewsCount(): number {
    return this.publicHistories
      ? this.publicHistories.filter((review) => review.isPublic).length
      : 0;
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
