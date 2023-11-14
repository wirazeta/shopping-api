import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemsService {

  constructor(private prisma: PrismaService){}

  create(createItemDto: CreateItemDto) {
    return 'This action adds a new item';
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

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
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
