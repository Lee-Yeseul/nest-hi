import { User } from 'src/auth/entity/user.entity';
import { WalkHistory } from 'src/walk-histories/entity/walkHistory.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Dog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  breed: string;

  @Column()
  age: number;

  @Column({ nullable: true })
  imagePath: string;

  @ManyToOne(() => User, (user) => user.dogs)
  owner: User;

  @OneToMany(() => WalkHistory, (walkHistory) => walkHistory.dog)
  walkHistories: WalkHistory[];

  @Column()
  ownerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
