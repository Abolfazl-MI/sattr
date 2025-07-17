import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ListenTimeEntity } from './entities/listenTime.entity';
import { UserMetaEntity } from './entities/userMeta.entity';
import { UserDataAcess } from './services/user.dataAcess.service';
import { BookModule } from 'src/book/book.module';
import { UserFavoriteEntity } from './entity/user.favorites';
import { UserFavoriteDataAcess } from './services/user.favorites.dataAcess';
import { UserDataAccess } from './user.data-access.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ListenTimeEntity, UserMetaEntity, UserFavoriteEntity]),
    BookModule,

  ],
  controllers: [UserController],
  providers: [UserService, UserDataAcess, UserFavoriteDataAcess ,UserDataAccess],
  exports: [UserService, UserDataAcess, UserFavoriteDataAcess , UserDataAccess],
})
export class UserModule { }
