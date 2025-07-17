import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { RegisterUserRequestDto } from '../../common/dto/registerUserRequestDto';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UserDataAccess } from './user.dataAcess.service';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';
import { UpdateProfileRequestDto } from '../dtos/update.profile.dto';
import { UserFavoriteDataAcess } from './user.favorites.dataAcess';
import { ListFavoriteItemsDto, UserFavoriteRequestDto } from '../dtos/userFavorite.request.dto';
import { ListRequestDto } from 'src/common/dtos/listRequestDto.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userDataAccess: UserDataAccess,
    private readonly favoriteDataAcess: UserFavoriteDataAcess
  ) { }

  async registerUser(data: RegisterUserRequestDto): Promise<UserEntity> {
    return this.userDataAccess.registerUser(data);
  }

  async findUserById(id: string): Promise<UserEntity> {
    return this.userDataAccess.findUserById(id)
  }

  async getUserProfile(id: SingleIdValidator) {
    return this.userDataAccess.getUserProfile(id)
  }
  async updateUserProfie(id: SingleIdValidator, request: UpdateProfileRequestDto) {
    return this.userDataAccess.updateProfile(id.id, request)
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

  async updateProfile(id: string, request: UpdateProfileRequestDto) {
    throw new NotImplementedException();
  }
  async findUser(options: FindOneOptions<UserEntity>) {
    return this.userDataAccess.findUser(options)
  }

  async userExists(options: FindManyOptions<UserEntity>) {
    return this.userDataAccess.userExists(options)
  }

  async verifyUserEmail(id: string, email: string) {
    return this.userDataAccess.verifyUserEmail(id, email);
  }
}
