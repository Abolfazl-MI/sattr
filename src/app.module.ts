import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { BookModule } from './book/book.module';
import { CategoryEntity } from './book/entities/category.entitiy';
import { BookEntity } from './book/entities/book.entity';
import { EpisodeEntity } from './book/entities/episode.entity';
@Module({
  imports: [
    BookModule,
    ConfigModule.forRoot(),
    CacheModule.register(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [BookEntity , CategoryEntity , EpisodeEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService ],
})
export class AppModule {}
