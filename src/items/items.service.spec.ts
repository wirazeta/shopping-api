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
      const mockImplementationFunction = jest.fn().mockImplementation(async () => {
        return item;
      })
      prismaMock.items.create.mockImplementation(mockImplementationFunction);
      const result = await service.create(item);
      expect(result).toMatchObject({
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
    });
  });
  describe('GetAllItems', () => {
    it('should return an array of items', async () => {
      const mockImplementationFunction = jest.fn().mockImplementation(async () => {
        return [
          {
            createdAt: null,
            deletedAt: null,
            id: 1,
            name: "tas",
            qty: 10,
            price: 50000,
            image: null,
            updatedAt: null,
            userId: 1,
          },
          {
            createdAt: null,
            deletedAt: null,
            id: 2,
            name: "buku",
            qty: 10,
            price: 5000,
            image: null,
            updatedAt: null,
            userId: 1,
          },
          {
            createdAt: null,
            deletedAt: null,
            id: 3,
            name: "dompet",
            qty: 10,
            price: 100000,
            image: null,
            updatedAt: null,
            userId: 1,
          }
        ]
      });
      prismaMock.items.findMany.mockImplementation(mockImplementationFunction);
      const items = await service.findAll();
      expect(items).toEqual(
        [
          {
            createdAt: null,
            deletedAt: null,
            id: 1,
            name: "tas",
            qty: 10,
            price: 50000,
            image: null,
            updatedAt: null,
            userId: 1,
          },
          {
            createdAt: null,
            deletedAt: null,
            id: 2,
            name: "buku",
            qty: 10,
            price: 5000,
            image: null,
            updatedAt: null,
            userId: 1,
          },
          {
            createdAt: null,
            deletedAt: null,
            id: 3,
            name: "dompet",
            qty: 10,
            price: 100000,
            image: null,
            updatedAt: null,
            userId: 1,
          }
        ]
      );
    });
    it('should return an array of items without deleted item', async () => {
      const mockImplementationFunction = jest.fn().mockImplementation(async (args) => {
        const { where } = args || {};
        if (where && where.deletedAt === null) {
          return [
            {
              createdAt: null,
              deletedAt: null,
              id: 1,
              name: "tas",
              qty: 10,
              price: 50000,
              image: null,
              updatedAt: null,
              userId: 1,
            },
            {
              createdAt: null,
              deletedAt: null,
              id: 2,
              name: "buku",
              qty: 10,
              price: 5000,
              image: null,
              updatedAt: null,
              userId: 1,
            },
          ]
        }
        return [
          {
            createdAt: null,
            deletedAt: null,
            id: 1,
            name: "tas",
            qty: 10,
            price: 50000,
            image: null,
            updatedAt: null,
            userId: 1,
          },
          {
            createdAt: null,
            deletedAt: null,
            id: 2,
            name: "buku",
            qty: 10,
            price: 5000,
            image: null,
            updatedAt: null,
            userId: 1,
          },
          {
            createdAt: null,
            deletedAt: new Date("2023-11-21T07:05:09.416Z").toISOString(),
            id: 3,
            name: "dompet",
            qty: 10,
            price: 100000,
            image: null,
            updatedAt: null,
            userId: 1,
          }
        ]
      });
      prismaMock.items.findMany.mockImplementation(mockImplementationFunction);
      const items = await service.findAll();
      expect(items.some(item => item.id === 3)).toBe(false);
      expect(items).toEqual(
        [
          {
            createdAt: null,
            deletedAt: null,
            id: 1,
            name: "tas",
            qty: 10,
            price: 50000,
            image: null,
            updatedAt: null,
            userId: 1,
          },
          {
            createdAt: null,
            deletedAt: null,
            id: 2,
            name: "buku",
            qty: 10,
            price: 5000,
            image: null,
            updatedAt: null,
            userId: 1,
          },
        ]
      );
    });
    it('should return an empty array', async () => {
      const mockImplementationFunction = jest.fn().mockImplementation(async () => {
        return [];
      });
      prismaMock.items.findMany.mockImplementation(mockImplementationFunction);
      const items = await service.findAll();
      expect(items).toEqual([]);
    });
  });
  describe('GetOneItem', () => {
    it('should return an item', async () => {
      const mockImplementationFunction = jest.fn().mockImplementation(async () => {
        return {
          createdAt: null,
          deletedAt: null,
          id: 1,
          name: "tas",
          qty: 10,
          price: 50000,
          image: null,
          updatedAt: null,
          userId: 1,
        }
      });
      prismaMock.items.findFirst.mockImplementation(mockImplementationFunction);
      const item = await service.findOne(1);
      expect(item).toEqual(
        {
          createdAt: null,
          deletedAt: null,
          id: 1,
          name: "tas",
          qty: 10,
          price: 50000,
          image: null,
          updatedAt: null,
          userId: 1,
        }
      );
    });
    it('should return null', async () => {
      const mockImplementationFunction = jest.fn().mockImplementation(async (args) => {
        const { where } = args || {};
        if (where && where.deletedAt === null && where.id === 1) {
          return null
        }
        return {
          createdAt: null,
          deletedAt: new Date("2023-11-21T07:05:09.416Z").toISOString(),
          id: 1,
          name: "tas",
          qty: 10,
          price: 50000,
          image: null,
          updatedAt: null,
          userId: 1,
        }
      });
      prismaMock.items.findFirst.mockImplementation(mockImplementationFunction);
      const item = await service.findOne(1);
      expect(item).toBeNull();
    });
  });
  describe('UpdateItem', () => {
    it('should return an item', async () => {
      const mockImplementationFunction = jest.fn().mockImplementation(async () => {
        return {
          createdAt: null,
          deletedAt: null,
          id: 1,
          name: "tas1",
          qty: 10,
          price: 50000,
          image: null,
          updatedAt: new Date("2023-11-21T07:05:09.416Z").toISOString(),
          userId: 1,
        }
      });
      prismaMock.items.update.mockImplementation(mockImplementationFunction);
      const item = await service.update(1, {name: 'tas1'});
      expect(item).toEqual(
        {
          createdAt: null,
          deletedAt: null,
          id: 1,
          name: "tas1",
          qty: 10,
          price: 50000,
          image: null,
          updatedAt: new Date("2023-11-21T07:05:09.416Z").toISOString(),
          userId: 1,
        }
      );
    });
    it('should return null', async () => {
      const mockImplementationFunction = jest.fn().mockImplementation(async (args) => {
        const { where } = args || {};
        if(where && where.id !== 1){
          return null;
        }
        return {
          createdAt: null,
          deletedAt: null,
          id: 1,
          name: "tas1",
          qty: 10,
          price: 50000,
          image: null,
          updatedAt: new Date("2023-11-21T07:05:09.416Z").toISOString(),
          userId: 1,
        }
      });
      prismaMock.items.update.mockImplementation(mockImplementationFunction);
      const item = await service.update(2, {name: "tas1"});
      expect(item).toBeNull();
    });
  });
  describe('DeleteItem', () => {
    it('should return an deleted item', async () => {
      const mockImplementationFunction = jest.fn().mockImplementation(async () => {
        return {
          createdAt: null,
          deletedAt: new Date("2023-11-21T07:05:09.416Z").toISOString(),
          id: 1,
          name: "tas1",
          qty: 10,
          price: 50000,
          image: null,
          updatedAt: null,
          userId: 1,
        }
      });
      prismaMock.items.update.mockImplementation(mockImplementationFunction);
      const item = await service.remove(1);
      expect(item).toEqual({
        createdAt: null,
        deletedAt: new Date("2023-11-21T07:05:09.416Z").toISOString(),
        id: 1,
        name: "tas1",
        qty: 10,
        price: 50000,
        image: null,
        updatedAt: null,
        userId: 1,
      });
    });
    it('should return null', async () => {
      const mockImplementationFunction = jest.fn().mockImplementation(async (args) => {
        const { where } = args || {};
        if(where && where.id !== 1){
          return null;
        }
        return {
          createdAt: null,
          deletedAt: new Date("2023-11-21T07:05:09.416Z").toISOString(),
          id: 1,
          name: "tas1",
          qty: 10,
          price: 50000,
          image: null,
          updatedAt: null,
          userId: 1,
        }
      });
      prismaMock.items.update.mockImplementation(mockImplementationFunction);
      const item = await service.remove(2);
      expect(item).toBeNull();
    });
  });
});
