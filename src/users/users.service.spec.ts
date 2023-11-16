import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock } from '../../singleton';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).overrideProvider(PrismaService).useValue(prismaMock).compile();

    service = module.get<UsersService>(UsersService);
  });
  (prismaMock.$transaction as jest.Mock).mockImplementation(async (cb: () => any) => cb());

  prismaMock.users.createMany({
    data: [
      { id: 1, username: "wira", firstName: "wira", lastName: "", email: "wira@gmail.com", password: "", phoneNumber: "", image: "", createdAt: null, deletedAt: null, updatedAt: null },
      { id: 2, username: "wira2", firstName: "wira2", lastName: "", email: "wira2@gmail.com", password: "", phoneNumber: "", image: "", createdAt: null, deletedAt: null, updatedAt: null }
    ]
  })

  describe('FindAllUser', () => {
    it('should return array of users', async () => {
      const result = [
        { id: 1, username: "wira", firstName: "wira", lastName: "", email: "wira@gmail.com", image: "", createdAt: null, deletedAt: null, updatedAt: null },
        { id: 2, username: "wira2", firstName: "wira2", lastName: "", email: "wira2@gmail.com", image: "", createdAt: null, deletedAt: null, updatedAt: null }
      ]
      expect(service.findAll()).toMatchObject(result);
    })
  })
});
