import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { UpdateProfileRequestDto } from './dtos/update.profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import path, { join, relative } from 'path';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';
import {
  AddFavoriteQueryDto,
  FavoiresFilter,
  GetFavoritesQueryDto,
  ListFavoriteItemsDto,
} from './dtos/userFavorite.request.dto';
import { ListRequestDto } from 'src/common/dtos/listRequestDto.dto';
import { multerOptions } from 'src/common/utils/upload.config';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUserProfiel(@Req() request: Express.Request) {
    console.log(request.user);
    return this.userService.getUserProfile({ id: request.user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/profile')
  @UseInterceptors(FileInterceptor('profile', multerOptions))
  async updateUserProfiel(
    @Req() request: Express.Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateProfileRequestDto,
  ) {
    if (file) {
      const absoluteFilePath = file.path; // this comes from Multer
      const uploadsPath = join(process.cwd(), 'public');
      const relativePath = relative(uploadsPath, absoluteFilePath);
      body.profilePicture = relativePath;
    }

    return this.userService.updateUserProfie(
      new SingleIdValidator(request.user.id),
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/favorites')
  async getUserFavorites(
    @Req() { user }: Express.Request,
    @Query() query: GetFavoritesQueryDto,
    @Query() listRequest: ListRequestDto,
  ) {
    const { filter } = query;
    const listFavItemRequest: ListFavoriteItemsDto = {
      id: user.id,
      listRequest,
    };
    switch (filter) {
      case FavoiresFilter.books:
        return this.userService.getFavoriteBooks(listFavItemRequest);
      case FavoiresFilter.episodes:
        return this.userService.getFavoriteEpisodes(listFavItemRequest);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/favorites/book/:id')
  async addBookToFavorite(
    @Req() { user }: Express.Request,
    @Param() { id }: SingleIdValidator,
  ) {
    return this.userService.addBookToFav({
      userId: user.id,
      entityId: id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/favorites/episode/:id')
  async addEpisodeToFavorite(
    @Req() { user }: Express.Request,
    @Param() { id }: SingleIdValidator,
  ) {
    return this.userService.addEpisodeToFav({
      userId: user.id,
      entityId: id,
    });
  }
}
