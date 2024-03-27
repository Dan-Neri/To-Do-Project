/**
 * This is the first file run by Nest which will use an async function
 * to bootstrap the API application. It uses the create() method of the
 * NestFactory class to create a Nest application instance and then
 * listens for requests with the root URL of http://localhost:3001/api.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Set the root folder
  app.setGlobalPrefix('api');
  //Allow requests from the UI
  app.enableCors({'origin': 'http://localhost:3000'});
  await app.listen(3001);
}
bootstrap();
