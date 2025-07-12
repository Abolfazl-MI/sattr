import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookEntity } from './book.entity';
import { UserFavoriteEntity } from 'src/user/entity/user.favorites';

@Entity('episode')
export class EpisodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  thumbnail: string;

  @Column()
  link: string;

  @ManyToOne(() => BookEntity, (book) => book.episodes)
  book: BookEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToMany(() => UserFavoriteEntity, userFav => userFav.favoritedEpisodeds)
  favoritedBy: UserFavoriteEntity[];
}
