import { UserEntity } from 'src/user/entities/user.entity';
import { UserMetaEntity } from 'src/user/entities/userMeta.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('plan')
export class PlanEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column()
  amountOff: number;

  @Column()
  index: number;

  @Column({ default: true, type: 'boolean' })
  isActive: boolean;

  @OneToMany(() => UserMetaEntity, (user) => user.plan)
  users: UserMetaEntity[];

  @Column({ type: 'int', default: 0 })
  durationInDays: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
