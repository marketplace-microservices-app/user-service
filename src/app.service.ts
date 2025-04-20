import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from './kafka/consumer.service';
import { KAFKA_TOPICS } from './kafka/topics/topics';
import { EachMessagePayload } from 'kafkajs';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerEntity } from './entity/seller.entity';
import { Repository } from 'typeorm';
import { BuyerEntity } from './entity/buyer.entity';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly kafkaConsumer: KafkaConsumerService,
    @InjectRepository(SellerEntity)
    private _sellerEntity: Repository<SellerEntity>,
    @InjectRepository(BuyerEntity)
    private _buyerEntity: Repository<BuyerEntity>,
  ) {}

  async onModuleInit() {
    await this.kafkaConsumer.subscribeToTopic(
      KAFKA_TOPICS.USER_CREATED,
      (payload) => this.consumeUserCreatedTopic(payload),
    );
  }

  private async consumeUserCreatedTopic({
    topic,
    partition,
    message,
  }: EachMessagePayload) {
    const value = message.value?.toString();
    console.log(
      `[Kafka Message] Topic: ${topic} | Partition: ${partition} | Message: ${value}`,
    );

    // Save to Seller ot Buyer Table based on the role
    const user = JSON.parse(value!);

    const { role } = user;

    let response;

    if (role === 'seller') {
      // Save to Seller table
      const newSeller = {
        user_id: user.userId,
        first_name: user.firstName,
        last_name: user.lastName,
        country: user.country,
      };

      response = await this._sellerEntity
        .save(newSeller)
        .catch((err) => console.error(err));
    } else {
      // Save to Buyer Table
      const newBuyer = {
        user_id: user.userId,
        first_name: user.firstName,
        last_name: user.lastName,
      };

      response = await this._buyerEntity.save(newBuyer);
    }

    if (!response) {
      console.error(`Something went wrong!`);
    }

    console.log(`User created as ${role} as successfully!`);
  }

  async getSellerBySellerId(sellerId: string) {
    const seller = await this._sellerEntity
      .findOne({ where: { id: sellerId } })
      .catch((err) => {
        console.error(err);
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong!',
        };
      });

    if (!seller) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Seller not found!',
      };
    }

    return {
      data: seller,
    };
  }

  async getBuyerDetailsFromUserId(userId: string) {
    const buyer = await this._buyerEntity
      .findOne({ where: { user_id: userId } })
      .catch((err) => {
        console.error(err);
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong!',
        };
      });

    if (!buyer) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Buyer not found!',
      };
    }

    return {
      data: buyer,
    };
  }
}
