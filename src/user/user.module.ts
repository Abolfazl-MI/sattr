import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { ListenTimeEntity } from './entity/listenTime.entity';
import { UserMetaEntity } from './entity/userMeta.entity';
import { UserDataAccess } from './user.data-access.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ListenTimeEntity, UserMetaEntity]),
  ],
  controllers: [UserController],
  providers: [UserService ,UserDataAccess],
  exports: [UserService , UserDataAccess],
})
export class UserModule {}
