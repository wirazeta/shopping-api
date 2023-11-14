import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) { }

    async signUp(data: any) {
        const user = await this.prisma.users.create({
            data: {
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: await bcrypt.hash(data.password, 10),
                phoneNumber: data.phoneNumber,
                image: data.image
            }
        })
        const payload = { user: user.id };
        return this.jwt.signAsync(payload);
    }

    async signIn(username: any, password: any) {
        const user = await this.prisma.users.findFirst({ select: { id: true, password: true }, where: { username: username } });
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch === false){
            throw new ForbiddenException
        }
        const payload = { user: user.id }
        return this.jwt.signAsync(payload);
    }
}
