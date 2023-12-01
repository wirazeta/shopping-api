import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock } from '../../singleton';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpStatus, INestApplication, Res } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { Readable } from 'stream';
import { Response } from 'express';

describe('AuthController', () => {
  let app: INestApplication;
  let controller: AuthController;
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, {
        provide: PrismaService,
        useValue: prismaMock
      }, JwtService],
    }).compile();
    app = module.createNestApplication();
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('POST /auth/register', () => {
    it('should return success response with token and handle file upload', async () => {
      const dataUser: CreateUserDto = {
        username: 'wira',
        firstName: 'wira',
        lastName: 'zeta',
        email: 'wira@gmail.com',
        password: '123456',
        phoneNumber: '1234567890',
      };
      const fileContent = 'file-content';
      const stream = Readable.from(fileContent);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

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
      // Mock the signUp method from the service to return a token
      jest.spyOn(service, 'signUp').mockResolvedValue('mocked-token');

      // Send a request to the endpoint with file upload
      await controller.signUp(dataUser, mockFile, res as Response);
      // console.log(response);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'success',
        statusCode: HttpStatus.CREATED,
        data: 'mocked-token',
      });

      // Ensure that the signUp method was called with the expected data
      expect(service.signUp).toHaveBeenCalledWith({
        ...dataUser,
        image: expect.any(String), // Ensure that image is present in the data
      });
    });
    it('should return success response with token without handle file upload', async () => {
      const dataUser: CreateUserDto = {
        username: 'wira',
        firstName: 'wira',
        lastName: 'zeta',
        email: 'wira@gmail.com',
        password: '123456',
        phoneNumber: '1234567890',
      };
      const mockRes: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      jest.spyOn(service, 'signUp').mockResolvedValue('mockedToken');
      await controller.signUp(dataUser, undefined, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'success',
        statusCode: HttpStatus.CREATED,
        data: 'mockedToken'
      });
    });
    it('should return error', async () => {
      const dataUser = {
        username: 'wira',
        firstName: 'wira',
        lastName: 'zeta',
        email: 'wira@gmail.com',
        password: '123456',
        phoneNumber: '1234567890',
      }
      const fileContent = 'file-content';
      const stream = Readable.from(fileContent);
      const mockRes: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
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
      jest.spyOn(service, 'signUp').mockResolvedValue(null);
      await controller.signUp(dataUser,mockFile,mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'failed',
        statusCode: HttpStatus.BAD_REQUEST,
        data: 'Username already registered'
      });
    });
  });
  describe('SignInUser', () => {
    it('should return success response with token', async () => {
      const dataUser = {
        username: "wira",
        password: "123456"
      }
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      jest.spyOn(service, 'signIn').mockResolvedValue('mockedToken');
      await controller.signIn(dataUser, res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'success',
        statusCode: HttpStatus.OK,
        data: 'mockedToken'
      });
    });
    it('shoul return forbidden response', async () => {
      const dataUser = {
        username: "wira",
        password: "1234567"
      }
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      jest.spyOn(service, 'signIn').mockResolvedValue(null);
      await controller.signIn(dataUser, res);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(res.json).toHaveBeenCalledWith({
        message: 'failed',
        statusCode: HttpStatus.FORBIDDEN
      });
    })
  });
});
