import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ListenTimeEntity } from './listenTime.entity';
import { UserMetaEntity } from './userMeta.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable:true})
  name: string;
  
  @Column({ nullable: false })
  phone: string;

  @Column({nullable:true})
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: UserRole.USER, enum: UserRole, type: 'enum' })
  role: UserRole;

  @OneToOne(() => ListenTimeEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  listenTime: ListenTimeEntity;

  @OneToOne(() => UserMetaEntity, { onDelete: 'CASCADE' })
  userMeta: UserMetaEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
