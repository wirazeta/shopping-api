import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService){}

    async signUp(data: any){
        const user = await this.prisma.users.create({data: data});
        const payload = {user: user.id};
        return this.jwt.signAsync(payload);
    }

    async signIn(username: any, password: any){
        const user = await this.prisma.users.findFirst({select:{id: true},where: {username: username, password: password}});
        const payload = {user: user.id}
        return this.jwt.signAsync(payload);
    }
}
