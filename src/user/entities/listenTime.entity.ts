import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('listen_time')
export class ListenTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  //todo link with episode late
  @Column()
  time: number;
}
