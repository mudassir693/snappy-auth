import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqService } from './rabbitmq/rabbitmq.service';
import { RmqOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('SNAPPY'));
  app.enableCors()
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
