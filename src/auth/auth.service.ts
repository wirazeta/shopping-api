import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService){}

    async signIn(username: any, password: any){
        const user = await this.prisma.users.findFirst({select:{id: true},where: {username: username, password: password}});
        const payload = {user: user.id}
        return this.jwt.signAsync(payload);
    }
}
