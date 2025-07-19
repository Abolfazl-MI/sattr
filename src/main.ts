import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });

  app.setGlobalPrefix('/api/v1');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,      // optional: strips unknown fields
    forbidNonWhitelisted: false,
    transform: true,
  }));
  const password = await bcrypt.hash('aA1383@@', 12)
  console.log(password)
  const swaggerConfig = new DocumentBuilder().setTitle('Satr').setDescription('Swagger documentation for Satr project').setVersion('1.0').build()
  const docFactory = () => SwaggerModule.createDocument(app, swaggerConfig, { autoTagControllers: true, deepScanRoutes: true }
  )
  SwaggerModule.setup('docs', app, docFactory)

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
