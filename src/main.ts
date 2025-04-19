import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
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
