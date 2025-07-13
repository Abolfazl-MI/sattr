import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,      // optional: strips unknown fields
    forbidNonWhitelisted: false,
    transform: true,
  }));
  const password = await bcrypt.hash('aA1383@@', 12)
  console.log(password)
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
