import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IsItemOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const ctx = context.switchToHttp().getRequest();
    const item = await this.prisma.items.findFirst({where:{id: ctx['params'].id}});
    if (!item){
      throw new ForbiddenException
    }
    return true;
  }
}
