import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
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
  species: string;

  @Column()
  age: number;

  @ManyToOne(() => User)
  place: User;

  @ManyToMany(() => Dog)
  @JoinTable({
    name: 'dog_friends',
    joinColumn: { name: 'dog_id' },
    inverseJoinColumn: { name: 'friend_id' },
  })
  friends: Dog[];
}
