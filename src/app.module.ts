import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import * as process from 'node:process';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { RedisOptions } from './common/utills/redis.config';
import { UserEntity } from './user/entity/user.entity';
import { ListenTimeEntity } from './user/entity/listenTime.entity';
import { UserMetaEntity } from './user/entity/userMeta.entity';
import { BookModule } from './book/book.module';
import { CategoryEntity } from './book/entities/category.entitiy';
import { BookEntity } from './book/entities/book.entity';
import { EpisodeEntity } from './book/entities/episode.entity';
import { TransactionModule } from './transaction/transaction.module';
import { TransactionEntity } from './transaction/entities/transaction';
import { BullModule } from '@nestjs/bullmq';
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
    ConfigModule.forRoot(),
    CacheModule.registerAsync(RedisOptions),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        UserEntity,
        ListenTimeEntity,
        UserMetaEntity,
        BookEntity,
        CategoryEntity,
        EpisodeEntity,
        TransactionEntity,
      ],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    BookModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
