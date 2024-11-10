import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,  {rawBody: true});

  app.enableCors({
    origin: 'http://localhost:5173',  // Asegúrate de que esta URL sea la correcta para tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],  // Encabezados permitidos
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
