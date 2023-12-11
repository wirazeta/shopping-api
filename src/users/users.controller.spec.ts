import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock } from '../../singleton';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service : UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, {
        provide: PrismaService,
        useValue: prismaMock
      }, JwtService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  describe('GetAllUsers', () => {
    it('should return all users', async () => {
      const data = [
        {
          id: 1,
          username: "wira",
          firstName: "wira",
          lastName: "",
          email: "wira@gmail.com",
          password: "123456",
          phoneNumber: "1234567890",
          createdAt: null,
          deletedAt: null,
          updatedAt: null,
          role: "user",
          image: null
        },
        {
          id: 2,
          username: "wira1",
          firstName: "wira1",
          lastName: "",
          email: "wira1@gmail.com",
          password: "123456",
          phoneNumber: "1234567890",
          createdAt: null,
          deletedAt: null,
          updatedAt: null,
          role: "user",
          image: null
        },
        {
          id: 3, 
          username: "wira2", 
          firstName: "wira2", 
          lastName: "", 
          email: "wira@2gmail.com", 
          password: "123456", 
          phoneNumber: "1234567890", 
          createdAt: null, 
          deletedAt: null, 
          updatedAt: null, 
          role: "user", 
          image: null
        },
      ]
      jest.spyOn(service, 'findAll').mockResolvedValue(data);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "All User Found",
        statusCode: HttpStatus.OK,
        data: data
      });
    });
    it('should return an empty array', async () => {
      const data = [];
      jest.spyOn(service, "findAll").mockResolvedValue(data);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      await controller.findAll(res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "All User Found",
        statusCode: HttpStatus.OK,
        data: []
      });
    });
  });
  describe("GetOneUser", () => {
    it('should return an user', async () => {
      const data = {
        id: 1,
        username: "wira",
        firstName: "wira",
        lastName: "",
        email: "wira@gmail.com",
        password: "123456",
        phoneNumber: "1234567890",
        createdAt: null,
        deletedAt: null,
        updatedAt: null,
        role: "user",
        image: null
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(data);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      await controller.findOne("1", res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "User Found",
        statusCode: HttpStatus.OK,
        data: data
      });
    });
    it('should return not found', async () => {
      const data = null;
      jest.spyOn(service, 'findOne').mockResolvedValue(data);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      await controller.findOne("1", res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
        statusCode: HttpStatus.NOT_FOUND,
        data: data
      });
    });
  });
  describe("UpdateUser", () => {
    it("should return user update", async () => {
      const data = {
        id: 1,
        username: "wira",
        firstName: "wira1",
        lastName: "",
        email: "wira@gmail.com",
        password: "123456",
        phoneNumber: "1234567890",
        createdAt: null,
        deletedAt: null,
        updatedAt: null,
        role: "user",
        image: null
      };
      jest.spyOn(service, "update").mockResolvedValue(data);
      const res:Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      await controller.update("1", {firstName: "wira1"}, res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "Update Success",
        statusCode: HttpStatus.OK,
        data: data
      });
    });
    it("should return bad request", async () => {
      const data = null;
      jest.spyOn(service, "update").mockResolvedValue(data);
      const res:Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      await controller.update("1", {firstName: "wira1"}, res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Update Failed",
        statusCode: HttpStatus.BAD_REQUEST,
        data: data
      });
    });
  });
  describe("DeleteUser", () => {
    it("should return ok response", async () => {
      const data = {
        id: 1,
        username: "wira",
        firstName: "wira1",
        lastName: "",
        email: "wira@gmail.com",
        password: "123456",
        phoneNumber: "1234567890",
        createdAt: null,
        deletedAt: new Date("2023-11-21T07:05:09.415Z"),
        updatedAt: null,
        role: "user",
        image: null
      };
      jest.spyOn(service, "remove").mockResolvedValue(data);
      const res:Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      await controller.remove("1", res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "Delete Success",
        statusCode: HttpStatus.OK
      });
    });
    it("should return bad request response", async () => {
      const data = null;
      jest.spyOn(service, "remove").mockResolvedValue(data);
      const res: Partial<Response> = {
        status:jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      await controller.remove("1", res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: "Delete Failed",
        statusCode: HttpStatus.BAD_REQUEST
      });
    });
  });
});
