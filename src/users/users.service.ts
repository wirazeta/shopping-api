import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.users.create({
      data: createUserDto
    });
    return user;
  }

  async findAll() {
    const user = (await this.prisma.users.findMany({
      where: {
        deletedAt: null
      }
    })).map((user) => {
      delete user.role;
      delete user.password;
      return user;
    });
    return user;
  }

  async findOne(id: number) {
    const user = this.prisma.users.findFirst({ 
      where: { 
        id: id, 
        deletedAt: null 
      } 
    }).then((user) => { 
      delete user.password; 
      delete user.role; 
      return user; 
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.update({ 
      where: { 
        id: id 
      }, 
      data: updateUserDto 
    }).then((user) => { 
      delete user.password; 
      delete user.role; 
      return user; 
    })
    return user;
  }

  async remove(id: number) {
    const user = await this.prisma.users.update({ 
      where: { 
        id: id 
      }, 
      data: { 
        deletedAt: new Date().toISOString() 
      } 
    }).then((user) => { 
      delete user.password; 
      delete user.role; 
      return user; 
    });
    return user;
  }
}