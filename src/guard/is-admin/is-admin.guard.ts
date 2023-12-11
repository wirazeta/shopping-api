import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private prisma: PrismaService){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const ctx = context.switchToHttp().getRequest();
    console.log(ctx['user'].user);
    const user = await this.prisma.users.findFirst({where:{id:ctx['user'].user}})
    if(user.role.toLowerCase() !== 'admin'){
      throw new ForbiddenException();
    }
    return true;
  }
}
