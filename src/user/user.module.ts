import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ListenTimeEntity } from './entities/listenTime.entity';
import { UserMetaEntity } from './entities/userMeta.entity';

import { BookModule } from 'src/book/book.module';

import { UserFavoriteDataAcess as UserFavoriteDataAccess } from './services/user.favorites.dataAcess';
import { UserFavoriteEntity } from './entities/user.favorites';
import { UserDataAccess } from './services/user.dataAcess.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ListenTimeEntity,
      UserMetaEntity,
      UserFavoriteEntity,
    ]),
    BookModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserDataAccess,
    UserFavoriteDataAccess,
  ],
  exports: [UserService, UserDataAccess, UserFavoriteDataAccess, UserDataAccess],
})
export class UserModule { }
