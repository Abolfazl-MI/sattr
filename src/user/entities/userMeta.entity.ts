import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { BookEntity } from 'src/book/entities/book.entity';
import { PlanEntity } from 'src/plan/entities/plan.entity';

@Entity('user_meta')
export class UserMetaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, (user) => user.userMeta)
  user: UserEntity;

  @ManyToMany(() => BookEntity, (book) => book.users)
  books: BookEntity[];

  // todo plan need plan

  @Column({ type: 'timestamp', nullable: true })
  subscriptionStartedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionExpiresAt: Date;

  @ManyToOne(() => PlanEntity, (plan) => plan.users)
  plan: PlanEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
