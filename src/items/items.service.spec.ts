import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock } from '../../singleton';

describe('ItemsService', () => {
  let service: ItemsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsService, PrismaService],
    }).overrideProvider(PrismaService).useValue(prismaMock).compile();
    service = module.get<ItemsService>(ItemsService);
  });
  describe('CreateItem', () => {
    it('should return object of item', async () => {
      const item = {
        id: 1,
        name: "tas",
        qty: 10,
        price: 50000,
        image: null,
        userId: 1,
        createdAt: null,
        deletedAt: null,
        updatedAt: null,
      }
      const result = prismaMock.items.create.mockResolvedValue(item);
      expect(await service.create(item)).toMatchObject({
        createdAt: null,
        deletedAt: null,
        id: 1,
        name: "tas",
        qty: 10,
        price: 50000,
        image: null,
        updatedAt: null,
        userId: 1,
      });
    })
  })
});
