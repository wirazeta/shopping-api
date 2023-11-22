import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock } from '../../singleton';
import { mockReset } from 'jest-mock-extended';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    prismaMock.users.findMany.mockReset();
    prismaMock.users.findFirst.mockReset();
    prismaMock.users.update.mockReset();
    prismaMock.users.delete.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).overrideProvider(PrismaService).useValue(prismaMock).compile();
    service = module.get<UsersService>(UsersService);
  });

  describe('FindAllUser', () => {
    it('should return array of users', async () => {
      prismaMock.users.findMany.mockResolvedValue([
        { id: 1, username: "wira", firstName: "wira", lastName: "", email: "wira@gmail.com", password: "123456", phoneNumber: "1234567890", createdAt: null, deletedAt: null, updatedAt: null, role: "user", image: null },
        { id: 2, username: "wira1", firstName: "wira1", lastName: "", email: "wira1@gmail.com", password: "123456", phoneNumber: "1234567890", createdAt: null, deletedAt: null, updatedAt: null, role: "user", image: null },
        { id: 3, username: "wira2", firstName: "wira2", lastName: "", email: "wira@2gmail.com", password: "123456", phoneNumber: "1234567890", createdAt: null, deletedAt: null, updatedAt: null, role: "user", image: null },
      ]);

      const users = await service.findAll();

      expect(users).toEqual([
        { id: 1, username: "wira", firstName: "wira", lastName: "", email: "wira@gmail.com", phoneNumber: "1234567890", createdAt: null, deletedAt: null, updatedAt: null, image: null },
        { id: 2, username: "wira1", firstName: "wira1", lastName: "", email: "wira1@gmail.com", phoneNumber: "1234567890", createdAt: null, deletedAt: null, updatedAt: null, image: null },
        { id: 3, username: "wira2", firstName: "wira2", lastName: "", email: "wira@2gmail.com", phoneNumber: "1234567890", createdAt: null, deletedAt: null, updatedAt: null, image: null },
      ]);
    });
    it('should return array of users and not include deleted user', async () => {
      const mockImplementationFunction = jest.fn().mockImplementation(async (args) => {
        const { where } = args || {};
        return [
          { id: 1, username: "wira", firstName: "wira", lastName: "", phoneNumber: "1234567890", email: "wira@gmail.com", password: "123456", role: "user", image: "", createdAt: new Date("2023-11-21T07:05:09.415Z"), deletedAt: null, updatedAt: null },
          { id: 2, username: "wira1", firstName: "wira1", lastName: "", phoneNumber: "1234567890", email: "wira1@gmail.com", password: "123456", role: "user", image: "", createdAt: new Date("2023-11-21T07:05:09.415Z"), deletedAt: null, updatedAt: null },
          { id: 3, username: "wira2", firstName: "wira2", lastName: "", phoneNumber: "1234567890", email: "wira@2gmail.com", password: "123456", role: "user", image: "", createdAt: new Date("2023-11-21T07:05:09.415Z"), deletedAt: new Date("2023-11-21T07:05:09.416Z").toISOString(), updatedAt: null },
        ].filter((user) => user.deletedAt === where.deletedAt);
      })
      prismaMock.users.findMany.mockImplementation(mockImplementationFunction)
      const users = await service.findAll();
      expect(users.some(user => user.id === 3)).toBe(false);
      expect(users).toEqual([
        { id: 1, username: "wira", firstName: "wira", lastName: "", phoneNumber: "1234567890", email: "wira@gmail.com", image: "", createdAt: new Date("2023-11-21T07:05:09.415Z"), deletedAt: null, updatedAt: null },
        { id: 2, username: "wira1", firstName: "wira1", lastName: "", phoneNumber: "1234567890", email: "wira1@gmail.com", image: "", createdAt: new Date("2023-11-21T07:05:09.415Z"), deletedAt: null, updatedAt: null },
      ]);
    });
    it('should return empty array', async () => {
      prismaMock.users.findMany.mockResolvedValue([]);
      const users = await service.findAll();
      expect(users).toEqual([]);
    });
  });
  describe("FindOneUser", () => {
    it('should return an object', async () => {
      prismaMock.users.findFirst.mockResolvedValue({ id: 1, username: "wira", firstName: "wira", lastName: "", email: "wira@gmail.com", password: "123456", phoneNumber: "1234567890", createdAt: null, deletedAt: null, updatedAt: null, role: "user", image: null });
      const user = await service.findOne(1);
      expect(user).toEqual({ id: 1, username: "wira", firstName: "wira", lastName: "", email: "wira@gmail.com", phoneNumber: "1234567890", createdAt: null, deletedAt: null, updatedAt: null, image: null });
    });
    it('should return null', async () => {
      prismaMock.users.findFirst.mockResolvedValue({ id: 1, username: "wira", firstName: "wira", lastName: "", email: "wira@gmail.com", password: "123456", phoneNumber: "1234567890", createdAt: null, deletedAt: new Date("2023-11-21T07:05:09.415Z"), updatedAt: null, role: "user", image: null });
      const user = await service.findOne(1);
      expect(user).toEqual(null);
    });
  });
  describe("UpdateUser", () => {
    it('should return an object', async () => {
      prismaMock.users.update.mockResolvedValue({ id: 1, username: "wira", firstName: "wira1", lastName: "", email: "wira@gmail.com", password: "123456", phoneNumber: "1234567890", createdAt: null, deletedAt: null, updatedAt: new Date("2023-11-21T07:05:09.415Z"), role: "user", image: null });
      const user = await service.update(1, { firstName: "wira1" });
      expect(user).toEqual({ id: 1, username: "wira", firstName: "wira1", lastName: "", email: "wira@gmail.com", phoneNumber: "1234567890", createdAt: null, deletedAt: null, updatedAt: new Date("2023-11-21T07:05:09.415Z"), image: null });
    });
    it('should return an error', async () => {
      const mockImplementationFunction = jest.fn().mockImplementation(async (args) => {
        const { where } = args || {};
        if (where.id !== 1) {
          return null;
        }
        return { id: 1, username: "wira", firstName: "wira1", lastName: "", email: "wira@gmail.com", password: "123456", phoneNumber: "1234567890", createdAt: null, deletedAt: null, updatedAt: new Date("2023-11-21T07:05:09.415Z"), role: "user", image: null }
      })
      prismaMock.users.update.mockImplementation(mockImplementationFunction);
      const user = await service.update(2, { firstName: "wira1" });
      expect(user).toBeNull();
    });
  });
  describe("DeleteUser", () => {
    const mockImplementationFunction = jest.fn().mockImplementation(async (args) => {
      const { where } = args || {};
      if (where.id !== 1) {
        return null;
      }
      return { id: 1, username: "wira", firstName: "wira", lastName: "", phoneNumber: "1234567890", email: "wira@gmail.com", password: "123456", role: "user", image: "", createdAt: new Date("2023-11-21T07:05:09.415Z"), deletedAt: new Date("2023-11-21T07:05:09.416Z").toISOString(), updatedAt: null }
    });
    it('should return a deleted user', async () => {
      prismaMock.users.update.mockImplementation(mockImplementationFunction)
      const user = await service.remove(1);
      expect(user).toEqual({ id: 1, username: "wira", firstName: "wira", lastName: "", phoneNumber: "1234567890", email: "wira@gmail.com", image: "", createdAt: new Date("2023-11-21T07:05:09.415Z"), deletedAt: new Date("2023-11-21T07:05:09.416Z").toISOString(), updatedAt: null });
    });
    it('should return null', async () => {
      prismaMock.users.update.mockImplementation(mockImplementationFunction)
      const user = await service.remove(2);
      expect(user).toBeNull();
    })
  });
});
