import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const ctx = context.switchToHttp().getRequest();
    if(parseInt(ctx['params'].id) !== ctx['user'].user){
      throw new ForbiddenException
    }
    return true;
  }
}
