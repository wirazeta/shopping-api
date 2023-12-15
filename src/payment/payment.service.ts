import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import Midtrans from 'midtrans-client';
import { PrismaService } from '@prisma/prisma.service';


@Injectable()
export class PaymentService {
  constructor(prisma: PrismaService){}
  create(data: any) {
    const parameter = {
      item_details: data.items,
      transaction_details: {
        order_id: data.order_id
      }
    }
    const snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.PUBLIC_API,
      clientKey: process.env.PUBLIC_CLIENT
    });

    // return 'This action adds a new payment';
    // return '';
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
