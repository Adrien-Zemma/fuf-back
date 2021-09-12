import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from '../service/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('balance/:id')
  getBalance(@Param('id') id): Promise<any> {
    return this.appService.getBalance(id);
  }

  @Post('transaction')
  createTransaction(
    @Body('to') to,
    @Body('from') from,
    @Body('arbitrator') arbitrator,
    @Body('amount') amount,

  ) {
    return this.appService.postTransaction(to, from, arbitrator, amount);
  }
}
