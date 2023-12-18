import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
// const midtrans = require('./midtrans-nodejs-client-master/index.js');
import { PrismaService } from '@prisma/prisma.service';
import { MidtransClient } from 'midtrans-node-client';


@Injectable()
export class PaymentService {
  constructor(prisma: PrismaService){}
  async create(data: any) {
    console.log(data);
    const items = data.items.map((item) => {
      const fixValue =  {...item, "quantity": item.qty};
      delete item.qty;
      return fixValue;
    })
    const parameter = {
      item_details: items,
      transaction_details: {
        order_id: data.id,
        gross_amount: data.totalPrice
      }
    }
    // const snap = new Midtrans.Snap({
    //   isProduction: false,
    //   serverKey: process.env.PUBLIC_API,
    //   clientKey: process.env.PUBLIC_CLIENT
    // });
    const core = new MidtransClient.Snap({
      isProduction: false,
      serverKey: process.env.PUBLIC_API,
      clientKey: process.env.PUBLIC_CLIENT
    })
    const token = await core.createTransactionToken(parameter);
    console.log(token);
    // return 'This action adds a new payment';
    return token;
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
