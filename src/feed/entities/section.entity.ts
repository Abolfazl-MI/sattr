import { BookEntity } from "src/book/entities/book.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('section')
export class SectionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    prioriry: number

    @ManyToMany(() => BookEntity, book => book.sections)
    @JoinTable()
    books: BookEntity[]

    @Column({ default: true, type: 'boolean' })
    isActive: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}