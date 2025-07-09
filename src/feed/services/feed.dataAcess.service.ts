import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SectionEntity } from "../entities/section.entity";
import { Repository } from "typeorm";
import { ListRequestDto } from "src/common/dtos/listRequestDto.dto";
import { SingleIdValidator } from "src/common/dtos/single-id-validator";
import { BookEntity } from "src/book/entities/book.entity";
import { BookDataAccess } from "src/book/services/book.data-access.service";
/* b.id,
      b.name,
      b."createdAt",
      b."thumbnail",
      b."author",
      b."translator",
      b."isIndividual", */
export interface SectionFeedResponse {
    id: string
    name: string
    prioriry: number
    books: FeedBookResponse[]
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface FeedBookResponse {
    name: string
    createdAt: Date
    thumbnail: string
    author: string
    translator: string
    isIndividual: boolean
    category: {
        id: number,
        title: string
    }
}


@Injectable()
export class FeedDataAcess {
    constructor(
        @InjectRepository(SectionEntity) private readonly repository: Repository<SectionEntity>,
        private readonly bookDataAcess: BookDataAccess) { }

    async list(request: ListRequestDto): Promise<{ data: SectionFeedResponse[], count: number }> {
        const { skip, take } = request;
        const [feeds, count] = await this.repository.findAndCount({
            where: {
                isActive: true,

            },
            order: {
                createdAt: 'DESC'
            },
            skip,
            take
        })


        const subBooks = await this.querySubBooks(feeds)
        const result = Array.from(subBooks)
        return {
            data: [
                ...result
            ],
            count
        }

    }

    async get(request: SingleIdValidator, listRequest: ListRequestDto): Promise<{
        data: SectionEntity,
        booksCount: number
    }> {
        const { skip, take } = listRequest
        const section = await this.repository.findOne({
            where: {
                id: request.id,
                isActive: true
            }
        })
        if (!section) {
            throw new NotFoundException('Feed with provided id not found')
        }
        const [books, total] = await this.bookDataAcess
            .createQueryBuilder('book')
            .innerJoin('book.sections', 'sections', 'sections.id = :sectionId', {
                sectionId: request.id,
            })
            .leftJoinAndSelect('book.category', 'category')
            .where('book.isActive = :active', { active: true })
            .skip(skip)
            .take(take)
            .getManyAndCount();
        section.books = books;
        return {
            data: { ...section },
            booksCount: total
        }
    }
    private async querySubBooks(sections: SectionEntity[]) {
        const sectionIds = sections.map((s) => `'${s.id}'`).join(',');
        const sql = `
  SELECT *
  FROM (
    SELECT
      b.id,
      b.name,
      b."createdAt",
      b."thumbnail",
      b."author",
      b."translator",
      b."isIndividual",
      bs."sectionId",
      c.id AS category_id,
      c.title AS category_name,
      ROW_NUMBER() OVER (
        PARTITION BY bs."sectionId"
        ORDER BY b."createdAt" DESC
      ) AS rn
    FROM
      book b
    JOIN section_books_book bs ON bs."bookId" = b.id
    JOIN book_category c ON c.id = b."categoryId"
    WHERE b."isActive" = true
      AND c."isActive" = true
      AND bs."sectionId" IN (${sectionIds})
  ) sub
  WHERE sub.rn <= 5
  ORDER BY sub."sectionId", sub."createdAt" DESC;
`;
        const result = await this.repository.query(sql);
        const response = new Map<string, SectionFeedResponse>();
        sections.map((section) => {
            response.set(section.id, { ...section, books: [] })
        })
        result.map((book) => {
            if (response.has(book.sectionId)) {
                response.get(book.sectionId)?.books?.push({
                    author: book.author,
                    name: book.name,
                    createdAt: book.createdAt,
                    thumbnail: book.thumbnail,
                    translator: book.translator,
                    isIndividual: book.isIndividual,
                    category: {
                        id: book.category_id,
                        title: book.category_name
                    }
                })
            }
        })
        return response.values();
    }
}


