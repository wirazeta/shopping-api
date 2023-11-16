import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [ItemsService],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    controller = module.get<ItemsController>(ItemsController);
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const result = [{ id: 1, name: "tas", qty: 2, price: 20000, userId: 2, image: '', createdAt: new Date(), deletedAt: new Date(null), updatedAt: new Date(null) }, { id: 2, name: "buku", qty: 3, price: 5000, userId: 2, image: '', createdAt: new Date(), deletedAt: new Date(null), updatedAt: new Date(null) }];
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);
      const res = {};
      expect(await controller.findAll(res)).toBe(result)
    })
  })
});
