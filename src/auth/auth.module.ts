import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtTokenService } from './jwt.service';
import { UserModule } from '../user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { ListenTimeEntity } from '../user/entity/listenTime.entity';
import { UserMetaEntity } from '../user/entity/userMeta.entity';
import { UserService } from '../user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserEntity, ListenTimeEntity, UserMetaEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global:true
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService, JwtService],
  exports: [AuthService , JwtTokenService ],
})
export class AuthModule {}
