import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) { }

  async findAll() {
    const users = (await this.prisma.users.findMany({ where: { deletedAt: null } }))?.map((user) => {
      delete user.role;
      delete user.password;
      return user;
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findFirst({
      where: {
        id: id,
        deletedAt: null
      }
    }).then((user) => {
      if (!user || user.deletedAt !== null) {
        return null;
      }
      delete user.password;
      delete user.role;
      return user;
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.update({
      where: {
        id: id,
      },
      data: { ...updateUserDto, updatedAt: new Date().toISOString() }
    }).then((user) => {
      if (!user) {
        return null;
      }
      delete user.password;
      delete user.role;
      return user;
    });
    // console.log(user);
    return user;
  }

  async remove(id: number) {
    const user = await this.prisma.users.update({
      where: {
        id: id,
      },
      data: { deletedAt: new Date().toISOString() }
    }).then((user) => {
      if (!user) {
        return null;
      }
      delete user.password;
      delete user.role;
      return user;
    });
    return user;
  }
}
