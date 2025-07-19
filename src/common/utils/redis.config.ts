import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  imports: [ConfigModule],
  isGlobal: true,
  useFactory: async (configService: ConfigService) => {
    console.log('trying to connect redis');
    console.log({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });

    const store = await redisStore({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });

    return {
      store,
    };
  },
  inject: [ConfigService],
};