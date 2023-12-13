import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { IsAdminGuard } from 'src/guard/is-admin/is-admin.guard';
import { AuthGuardGuard } from 'src/guard/auth-guard/auth-guard.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
