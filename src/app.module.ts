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
import { RedisOptions } from './common/utils/redis.config';
import { UserEntity } from './user/entities/user.entity';
import { ListenTimeEntity } from './user/entities/listenTime.entity';
import { UserMetaEntity } from './user/entities/userMeta.entity';
import { BookModule } from './book/book.module';
import { CategoryEntity } from './book/entities/category.entitiy';
import { BookEntity } from './book/entities/book.entity';
import { EpisodeEntity } from './book/entities/episode.entity';
import { TransactionModule } from './transaction/transaction.module';
import { TransactionEntity } from './transaction/entities/transaction.entity';
import { PlanModule } from './plan/plan.module';
import { PlanEntity } from './plan/entities/plan.entity';
import { CouponModule } from './coupon/coupon.module';
import { CouponEntity } from './coupon/entities/coupon.entity';
import { FeedModule } from './feed/feed.module';
import { SectionEntity } from './feed/entities/section.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/public', // or just '/' if you want
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
      // entities: [
      //   UserEntity,
      //   ListenTimeEntity,
      //   UserMetaEntity,
      //   BookEntity,
      //   CategoryEntity,
      //   EpisodeEntity,
      //   TransactionEntity,
      //   PlanEntity,
      //   CouponEntity,,
      //   SectionEntity
      // ],
      autoLoadEntities:true,
      logging:true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    BookModule,
    TransactionModule,
    PlanModule,
    CouponModule,
    FeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
