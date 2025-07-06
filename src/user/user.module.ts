import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { ListenTimeEntity } from './entity/listenTime.entity';
import { UserMetaEntity } from './entity/userMeta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ListenTimeEntity, UserMetaEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
