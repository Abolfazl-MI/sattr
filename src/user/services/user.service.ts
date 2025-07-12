import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserRequestDto } from '../../common/dto/registerUserRequestDto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UserDataAcess } from './user.dataAcess.service';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';
import { UpdateProfileRequestDto } from '../dtos/update.profile.dto';
import { UserFavoriteDataAcess } from './user.favorites.dataAcess';
import { ListFavoriteItemsDto, UserFavoriteRequestDto } from '../dtos/userFavorite.request.dto';
import { ListRequestDto } from 'src/common/dtos/listRequestDto.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userDataAcess: UserDataAcess,
    private readonly favoriteDataAcess: UserFavoriteDataAcess
  ) { }

  async registerUser(data: RegisterUserRequestDto): Promise<UserEntity> {
    return this.userDataAcess.registerUser(data);
  }

  async findUserById(id: string): Promise<UserEntity> {
    return this.userDataAcess.findUserById(id)
  }

  async getUserProfile(id: SingleIdValidator) {
    return this.userDataAcess.getUserProfile(id)
  }
  async updateUserProfie(id: SingleIdValidator, request: UpdateProfileRequestDto) {
    return this.userDataAcess.updateProfile(id.id, request)
  }

  async addBookToFav(request: UserFavoriteRequestDto) {
    return this.favoriteDataAcess.addBookToUserFavorite(request)
  }

  async removeBookFromFav(request: UserFavoriteRequestDto) {
    return this.favoriteDataAcess.removeBookFromFavorites(request)
  }

  async addEpisodeToFav(request: UserFavoriteRequestDto) {
    return this.favoriteDataAcess.addEpisodeToUserFavorite(request)
  }

  async removeEpiseFromFav(request: UserFavoriteRequestDto) {
    return this.favoriteDataAcess.removeEpisodeFromUserFavorite(request)
  }
  async getFavoriteBooks(request: ListFavoriteItemsDto) {
    return this.favoriteDataAcess.listFavrotedBooks(request)
  }
  async getFavoriteEpisodes(request: ListFavoriteItemsDto) {
    return this.favoriteDataAcess.listFavrotedEpisodes(request)
  }
}
