import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ListenTimeEntity } from './listenTime.entity';
import { UserMetaEntity } from './userMeta.entity';
import { UserFavoriteEntity } from './user.favorites';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: UserRole.USER, enum: UserRole, type: 'enum' })
  role: UserRole;

  @OneToOne(() => ListenTimeEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  listenTime: ListenTimeEntity;

  @OneToOne(() => UserMetaEntity, (meta) => meta.user, { onDelete: 'CASCADE' , cascade:true })
  @JoinColumn()
  userMeta: UserMetaEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserFavoriteEntity, { onDelete: 'CASCADE' })
  @JoinTable()
  favorites: UserFavoriteEntity
}
