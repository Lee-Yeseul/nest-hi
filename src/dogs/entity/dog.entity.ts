import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
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
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.dogs)
  owner: User;

  @Column()
  ownerId: number;

  // @ManyToMany(() => Dog)
  // @JoinTable({
  //   name: 'friendship',
  //   joinColumn: { name: 'id' },
  //   inverseJoinColumn: { name: 'friendId' },
  // })
  // friends: Dog[];
}
