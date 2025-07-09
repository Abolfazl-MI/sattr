import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { BookEntity } from 'src/book/entities/book.entity';

@Entity('user_meta')
export class UserMetaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, (user) => user.userMeta)
  user: UserEntity;

  @ManyToMany(() => BookEntity, (book) => book.users)
  books: BookEntity[];

  // todo plan need plan
  @Column()
  activationDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
