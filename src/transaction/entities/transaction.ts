import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../enums/status.enum';
import { BookEntity } from 'src/book/entities/book.entity';
import { PurchaseType } from '../enums/purchase-type.enum';

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;

  @Column({ type: 'varchar' })
  token: string;

  // coupon

  @Column({ type: 'enum', enum: PurchaseType })
  purchaseType: PurchaseType;

  @ManyToOne(() => BookEntity, { nullable: true })
  book: BookEntity;

  //   plan:
}
