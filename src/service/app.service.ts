import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Airtable, { FieldSet, Table } from "airtable";

@Injectable()
export class AppService {
  private airtable: Airtable.Base;
  private wallet: Table<FieldSet>;
  private transaction: Table<FieldSet>;

  constructor(private configService: ConfigService) {
    this.airtable = new Airtable({
      endpointUrl: "https://api.airtable.com",
      apiKey: this.configService.get("AIRTABLE_API_KEY")
    }).base("app5r4yXqDNXaIv7W");

    this.wallet = this.airtable.table("wallet");
    this.transaction = this.airtable.table("transaction");
  }

  getHello(): string {
    return "Hello World!";
  }

  async getBalance(user: string) {
    return (
      await this.wallet.select({ filterByFormula: "identifiant=" + user }).all()
    )[0]?.fields;
  }

  async createBalance(user: string, balance = "0") {
    return this.wallet.create({ identifiant: user, wallet: balance });
  }

  async setBalance(user: string, balance) {
    return this.wallet.update({ identifiant: user, wallet: "0" });
  }

  async postTransaction(
    to = "0",
    from: string,
    arbitrator: string,
    amount: number
  ) {
    if (!(await this.getBalance(to))) {
      await this.createBalance(to);
    }

    if (!(await this.getBalance(from))) {
      await this.createBalance(to);
    }

    const balance = await this.getBalance(from);
    if (+balance < amount) {
      return { message: "L'empire ne fait pas crédit", status: 405 };
    }

    try {
      await this.transaction.create([
        { fields: { to, from, arbitrator, amount, date: Date.now() } }
      ]);
      return { message: "ok" };
    } catch (e) {
      throw new HttpException(e, 400);
    }
  }
}
