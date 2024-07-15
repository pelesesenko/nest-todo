import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { exceptionFactory } from '@common/pipes';
import { ValidationPipe } from '@nestjs/common';

const Port = process.env.PORT || 3000;
async function start() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  const config = new DocumentBuilder()
    .setTitle('Todo')
    .setDescription('Todo API description')
    .setVersion('1.0')
    .addTag('Todo')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ exceptionFactory }));

  await app.listen(Port, () => console.log('Server started at port ' + Port));
}
start();
