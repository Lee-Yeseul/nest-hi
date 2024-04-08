import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SocialProvider, socialProvider } from '../enum/socialProvider.model';

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

  @Column({ name: 'local_refresh_token', nullable: true })
  localRefreshToken: string;

  @Column({ name: 'local_refresh_token_exp', nullable: true })
  localRefreshTokenExp: Date;

  @Column({ name: 'is_social_account_registered', default: false })
  isSocialAccountRegistered: boolean;

  @Column({ name: 'social_provider', default: socialProvider.LOCAL })
  socialProvider: SocialProvider;

  @Column({ name: 'social_id', nullable: true, default: null })
  socialId: string;

  @Column({ name: 'social_refresh_token', nullable: true, default: null })
  socialProvidedRefreshToken: string;
}
