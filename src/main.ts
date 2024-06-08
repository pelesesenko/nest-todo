import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const Port = process.env.PORT || 3000;
async function start() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Port, () => console.log('Server started at port ' + Port));
}
start();
