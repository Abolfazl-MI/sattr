import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ListenTimeEntity } from './entities/listenTime.entity';
import { UserMetaEntity } from './entities/userMeta.entity';
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
