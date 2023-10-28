import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { InvoicesModule } from './invoices/invoices.module';
import { InvoiceItemsModule } from './invoice-items/invoice-items.module';
// import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, ItemsModule, InvoicesModule, InvoiceItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
