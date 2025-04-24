import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const kafkaBroker = configService.get<string>('KAFKA_BROKER');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: kafkaBroker ? [kafkaBroker] : [],
      },
      consumer: {
        groupId: 'users-service-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  const PORT = 3002;
  await app.listen(PORT);
  console.log(`Started users microservice on ${PORT}`);
}
bootstrap();
