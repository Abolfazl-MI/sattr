import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { ListenTimeEntity } from './entity/listenTime.entity';
import { UserMetaEntity } from './entity/userMeta.entity';
import { UserDataAcess } from './services/user.dataAcess.service';
import { BookModule } from 'src/book/book.module';
import { UserFavoriteEntity } from './entity/user.favorites';
import { UserFavoriteDataAcess } from './services/user.favorites.dataAcess';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ListenTimeEntity, UserMetaEntity, UserFavoriteEntity]),
    BookModule,

  ],
  controllers: [UserController],
  providers: [UserService, UserDataAcess, UserFavoriteDataAcess],
  exports: [UserService, UserDataAcess, UserFavoriteDataAcess],
})
export class UserModule { }
