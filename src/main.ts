import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import getLogLevels from './get-log-levels';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      'http://localhost:8888',
      'https://kanastra-challenge-frontend.vercel.app/',
    ],
    methods: ['GET', 'POST'],
    credentials: false,
  });
  await app.listen(3000);
}

bootstrap();
