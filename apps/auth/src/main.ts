import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { exceptionFactory } from '@common/pipes';
import { ValidationPipe } from '@nestjs/common';

const Port = process.env.PORT || 3000;
async function start() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  const config = new DocumentBuilder()
    .setTitle('Hotels-todo')
    .setDescription('The Hotels-todo API description')
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
