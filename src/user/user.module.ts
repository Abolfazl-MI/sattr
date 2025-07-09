import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { ListenTimeEntity } from './entity/listenTime.entity';
import { UserMetaEntity } from './entity/userMeta.entity';
import { UserDataAcess } from './services/user.dataAcess.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ListenTimeEntity, UserMetaEntity]),
  ],
  controllers: [UserController],
  providers: [UserService, UserDataAcess],
  exports: [UserService],
})
export class UserModule { }
