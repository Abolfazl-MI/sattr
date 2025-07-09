import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../enums/status.enum';
import { BookEntity } from 'src/book/entities/book.entity';
import { PurchaseType } from '../enums/purchase-type.enum';
import { PlanEntity } from 'src/plan/entity/plan.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Entity('transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'int' , default:0 })
  discount: number;

  @Column({ type: 'enum', enum: PurchaseType })
  purchaseType: PurchaseType;

  @ManyToOne(() => BookEntity, { nullable: true })
  book: BookEntity;

  @ManyToOne(() => PlanEntity, { nullable: true })
  plan: PlanEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
