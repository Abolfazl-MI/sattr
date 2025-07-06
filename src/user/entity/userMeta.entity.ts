import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_meta')
export class UserMetaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // todo purchased book depends on books module
  // todo plan need plan
  @Column()
  activationDate: Date;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
