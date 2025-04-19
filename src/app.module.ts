import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { KafkaConsumerService } from './kafka/consumer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerEntity } from './entity/buyer.entity';
import { SellerEntity } from './entity/seller.entity';

@Module({
  imports: [
    KafkaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'users',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([SellerEntity, BuyerEntity]),
  ],
  controllers: [AppController],
  providers: [AppService, KafkaConsumerService],
})
export class AppModule {}
