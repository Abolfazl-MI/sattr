import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TYPE } from '../enums/type.enum';

@Entity('coupon')
export class CouponEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'enum', enum: TYPE })
  type: TYPE;

  @Column({ type: 'int' })
  value: number;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
