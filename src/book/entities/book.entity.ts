import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entitiy';
import { EpisodeEntity } from './episode.entity';

@Entity('book')
export class BookEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  thumbnail: string;

  @Column({ type: 'varchar' })
  author: string;

  @Column({ type: 'varchar' })
  translator: string;

  @Column({ type: 'date' })
  publishDate: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: false })
  isIndividual: boolean;

  @ManyToOne(() => CategoryEntity, (category) => category.books, {
    onDelete: 'CASCADE',
  })
  category: CategoryEntity;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar' })
  demoLink: string;

  @OneToMany(() => EpisodeEntity, (episode) => episode.book)
  episodes: EpisodeEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
