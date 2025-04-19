import { Controller, Get } from '@nestjs/common';
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
}
