import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('api/users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('users.get-seller-by-seller-id')
  @Get('get-seller-by-seller-id')
  getSellerBySellerId(@Payload() data: { sellerId: string }) {
    const { sellerId } = data;
    return this.appService.getSellerBySellerId(sellerId);
  }

  @MessagePattern('users.get-buyer-details-from-userId')
  @Post('get-buyer-details-from-userId')
  getBuyerDetailsFromUserId(@Payload() data: { userId: string }) {
    return this.appService.getBuyerDetailsFromUserId(data.userId);
  }

  @MessagePattern('users.get-seller-details-from-userId')
  @Post('get-seller-details-from-userId')
  getSellerDetailsFromUserId(@Payload() userId: string) {
    return this.appService.getSellerDetailsFromUserId(userId);
  }
}
