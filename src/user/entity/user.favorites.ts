import { BookEntity } from "src/book/entities/book.entity";
import { EpisodeEntity } from "src/book/entities/episode.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('user_favorite')
export class UserFavoriteEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToMany(() => BookEntity, book => book.favortedBooks, { onDelete: 'CASCADE' })
    @JoinTable()
    favoritedBooks: BookEntity[]

    @ManyToMany(() => EpisodeEntity, episode => episode.favoritedBy, { onDelete: 'CASCADE' })
    @JoinTable()
    favoritedEpisodeds: EpisodeEntity[];

    @OneToOne(() => UserEntity, user => user.favorites, { onDelete: 'NO ACTION' })
    @JoinColumn()
    user: UserEntity


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: true })
    isActive: boolean
}