import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemsService {

  constructor(private prisma: PrismaService){}

  async create(data: any) {
    const item = await this.prisma.items.create({
      data:{
        name: data.name,
        price: data.price,
        qty: data.qty,
        image: data.image,
        userId: data.userId
      }
    })
    return item;
  }

  async findAll() {
    const items = await this.prisma.items.findMany({
      where:{deletedAt: null}
    });
    return items;
  }

  async findOne(id: number) {
    const item = await this.prisma.items.findFirst({
      where:{id: id, deletedAt: null}
    }).then((item) => {
      if(!item){
        return null
      }
    })
    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.prisma.items.update({where:{id: id}, data: updateItemDto}).then((item) => {
      if(item === null){
        return null;
      }
      delete item.deletedAt;
      delete item.createdAt;
      delete item.updatedAt;
    });
    return item;
  }

  async remove(id: number) {
    const item = await this.prisma.items.update({where:{id: id}, data:{deletedAt: new Date().toISOString()}}).then((item) => {
      if(!item){
        return null
      }
    });
    return item;
  }
}
