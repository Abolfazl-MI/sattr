

import { Injectable, NotFoundException } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { BookDataAccess } from "src/book/services/book.data-access.service";
import { Repository } from "typeorm";



import { ListFavoriteItemsDto, UserFavoriteRequestDto } from "../dtos/userFavorite.request.dto";
import { EpisodeDataAccess } from "src/book/episode-dataAcess.service";
import { UserFavoriteEntity } from "../entities/user.favorites";

@Injectable()
export class UserFavoriteDataAcess {

    constructor(
        @InjectRepository(UserFavoriteEntity) private readonly repository: Repository<UserFavoriteEntity>,
        private readonly bookDataAcess: BookDataAccess,
        private readonly episodeDataAcess: EpisodeDataAccess
    ) { }

    async addBookToUserFavorite(request: UserFavoriteRequestDto) {
        const { entityId, userId } = request
        let userFavorite = await this.repository.findOne({
            where: {
                isActive: true,
                user: {
                    id: userId
                }
            }
        })
        const book = await this.bookDataAcess.findOneById({
            id: entityId
        })
        if (!book) throw new NotFoundException()

        if (!userFavorite) {
            userFavorite = this.repository.create({
                user: { id: userId },
                isActive: true
            });
            await this.repository.save(userFavorite);
        }

        await this.repository
            .createQueryBuilder()
            .relation(UserFavoriteEntity, 'favoritedBooks')
            .of(userFavorite.id)
            .add(book);
        return {
            message: 'Added to favorite'
        }
    }
    async removeBookFromFavorites(request: UserFavoriteRequestDto) {
        const { entityId: id, userId } = request
        const userFavorite = await this.repository.findOne({
            where: {
                isActive: true,
                user: {
                    id: userId
                }
            }
        })
        const book = await this.bookDataAcess.findOneById({
            id
        })
        if (!book || !userFavorite) throw new NotFoundException()

        await this.repository
            .createQueryBuilder()
            .relation(UserFavoriteEntity, 'favoritedBooks') // Relationship property name
            .of(userFavorite.id) // Owner side of the relation (favorite ID)
            .remove(book);
        return {
            message: 'Added to favorite'
        }
    }
    async addEpisodeToUserFavorite(request: UserFavoriteRequestDto) {
        const { entityId: id, userId } = request
        let userFavorite = await this.repository.findOne({
            where: {
                isActive: true,
                user: {
                    id: userId
                }
            }
        })
        const episode = await this.bookDataAcess.findOneEpisode({
            where: {
                id
            }
        })
        if (!episode) throw new NotFoundException()

        if (!userFavorite) {
            userFavorite = this.repository.create({
                user: { id: userId },
                isActive: true
            });
            await this.repository.save(userFavorite);
        }
        await this.repository
            .createQueryBuilder()
            .relation(UserFavoriteEntity, 'favoritedEpisodeds') // Relationship property name
            .of(userFavorite.id) // Owner side of the relation (favorite ID)
            .add(episode);
        return {
            message: 'Added to favorite'
        }
    }
    async removeEpisodeFromUserFavorite(request: UserFavoriteRequestDto) {
        const { entityId: id, userId } = request
        const userFavorite = await this.repository.findOne({
            where: {
                isActive: true,
                user: {
                    id: userId
                }
            }
        })
        const episode = await this.bookDataAcess.findOneEpisode({
            where: {
                id
            }
        })
        if (!episode || !userFavorite) throw new NotFoundException()

        await this.repository
            .createQueryBuilder()
            .relation(UserFavoriteEntity, 'favoritedEpisodeds') // Relationship property name
            .of(userFavorite.id) // Owner side of the relation (favorite ID)
            .remove(episode);
        return {
            message: 'Added to favorite'
        }
    }

    async listFavrotedEpisodes(request: ListFavoriteItemsDto) {
        const { id } = request
        const { skip, take } = request.listRequest;
        const sq = await this.episodeDataAcess
            .createQueryBuilder('episode')
            .innerJoin('episode.favoritedBy', 'favorite') // ✅ Correct
            .innerJoin('favorite.user', 'user')
            .where('user.id = :userId', { userId: id });
        const [episodes, count] = await sq.select([
            'episode.id',
            'episode.name',
            'episode.thumbnail'
        ]).skip(skip).take(take).getManyAndCount()
        return {
            data: episodes,
            count
        }
    }
    async listFavrotedBooks(request: ListFavoriteItemsDto) {
        const { id } = request
        const { skip, take } = request.listRequest;
        const sq = await this.bookDataAcess.createQueryBuilder('book').innerJoin('book.favortedBooks', 'favorite').innerJoin('favorite.user', 'user').where('user.id = :userId', { userId: id })
        const [books, count] = await sq.select([
            'book.id',
            'book.name',
            'book.thumbnail'
        ]).skip(skip).take(take).getManyAndCount()
        return {
            data: books,
            count
        }
    }
}