import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { JwtTokenService } from './services/jwt.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';


import { UserEntity } from '../user/entities/user.entity';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { OtpService } from './services/otp.service';
import { ListenTimeEntity } from 'src/user/entities/listenTime.entity';
import { UserMetaEntity } from 'src/user/entities/userMeta.entity';

@Module({
  imports: [
      UserModule,
    TypeOrmModule.forFeature([UserEntity, ListenTimeEntity, UserMetaEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService, JwtService, OtpService],
  exports: [AuthService, JwtTokenService],
})
export class AuthModule {}
