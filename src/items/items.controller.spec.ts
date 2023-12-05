import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock } from '../../singleton';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import stream, { Readable } from 'stream';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [ItemsService, {
        provide: PrismaService,
        useValue: prismaMock
      }, JwtService],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    controller = module.get<ItemsController>(ItemsController);
  });

  describe("createItem", () => {
    it('should return an item', async () => {
      const result = {
        id: 1,
        name: "tas",
        qty: 10,
        price: 50000,
        image: 'path/to/file',
        userId: 1,
        createdAt: null,
        deletedAt: null,
        updatedAt: null,
      }
      const fileContent = 'file-content';
      const stream = Readable.from(fileContent);
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'example.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        buffer: Buffer.from('file-content'), // Buffer contain file content
        size: 12345, // file size in byte
        destination: 'path/to/destination',
        filename: 'example.txt',
        path: 'path/to/file',
        stream: stream
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      jest.spyOn(service, 'create').mockResolvedValue(result);
      await controller.create(result, { user: { user: 1 } }, mockFile, res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: "Create Success",
        statusCode: HttpStatus.CREATED,
        data: result
      });
    });
    it('should return an item without image', async () => {
      const result = {
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
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      jest.spyOn(service, 'create').mockResolvedValue(result);
      await controller.create(result, { user: { user: 1 } }, undefined, res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: "Create Success",
        statusCode: HttpStatus.CREATED,
        data: result
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const result = [
        {
          id: 1,
          name: "tas",
          qty: 2,
          price: 20000,
          userId: 2,
          image: '',
          createdAt: new Date(),
          deletedAt: new Date(null),
          updatedAt: new Date(null)
        },
        {
          id: 2,
          name: "buku",
          qty: 3,
          price: 5000,
          userId: 2,
          image: '',
          createdAt: new Date(),
          deletedAt: new Date(null),
          updatedAt: new Date(null)
        }
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      await controller.findAll(res)
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'All Items Found',
        statusCode: HttpStatus.OK,
        data: result
      });
    });
    it('should return an empty array', async () => {
      const result = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'All Items Found',
        statusCode: HttpStatus.OK,
        data: result
      });
    });
  });
  describe('findOne', () => {
    it('should return an item', async () => {
      const result = {
        id: 1,
        name: "tas",
        qty: 2,
        price: 20000,
        userId: 2,
        image: '',
        createdAt: new Date(),
        deletedAt: new Date(null),
        updatedAt: new Date(null)
      }
      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      await controller.findOne('1', res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "Item found",
        statusCode: HttpStatus.OK,
        data: result
      });
    });
    it('should return not found', async () => {
      const result = null;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      await controller.findOne('2', res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Item not found',
        statusCode: HttpStatus.NOT_FOUND
      });
    });
  });
});
