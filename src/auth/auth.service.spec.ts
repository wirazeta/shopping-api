import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '@prisma/prisma.service';
import { prismaMock } from 'singleton';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).overrideProvider(PrismaService).useValue(prismaMock).compile();
    service = module.get<AuthService>(AuthService);
  });
  describe('SignupUser', () => {

  })
});
