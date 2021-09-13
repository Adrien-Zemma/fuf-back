import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Airtable, { FieldSet, Table } from 'airtable';

@Injectable()
export class AppService {
  private airtable: Airtable.Base;
  private wallet: Table<FieldSet>;
  private transaction: Table<FieldSet>;

  constructor(private configService: ConfigService) {
    this.airtable = new Airtable({
      endpointUrl: 'https://api.airtable.com',
      apiKey: this.configService.get('AIRTABLE_API_KEY'),
    }).base('app5r4yXqDNXaIv7W');

    this.wallet = this.airtable.table('wallet');
    this.transaction = this.airtable.table('transaction');
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getBalance(user: string) {
    return (
      await this.wallet.select({ filterByFormula: 'identifiant=' + user }).all()
    )[0]?.fields;
  }

  async postTransaction(
    to = '0',
    from: string,
    arbitrator: string,
    amount: number,
  ) {
    try {
      await this.transaction.create([
        { fields: { to, from, arbitrator, amount, date: Date.now() } },
      ]);
      return { message: 'ok' };
    } catch (e) {
      throw new HttpException(e, 400);
    }
  }
}
