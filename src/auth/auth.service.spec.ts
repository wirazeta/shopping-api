import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock } from '../../singleton';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const secretKey = process.env.JWT_SECRET;
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService], 
      imports: [
        JwtModule.register({
          secret: secretKey || 'defaultSecretKey'
        })
      ]
    }).overrideProvider(PrismaService).useValue(prismaMock).compile();
    service = module.get<AuthService>(AuthService);
  });
  describe('SignUpUser', () => {
    it('should return token', async () => {
      const mockImplementationFunction = jest.fn().mockImplementation(async () => {
        return {
          id: 1,
          username: "wira",
          firstName: "wira",
          lastName: "zeta",
          email: "wira@gmail.com",
          password: "123456",
          phoneNumber: "1234567890",
          image: null,
          createdAt: null,
          deletedAt: null,
          updatedAt: null
        }
      });
      prismaMock.users.create.mockImplementation(mockImplementationFunction);
      const register = await service.signUp({
        id: 1,
        username: "wira",
        firstName: "wira",
        lastName: "zeta",
        email: "wira@gmail.com",
        password: "123456",
        phoneNumber: "1234567890",
        image: null,
        createdAt: null,
        deletedAt: null,
        updatedAt: null
      });
      expect(register.length).toBeGreaterThanOrEqual('hello'.length);
    });
    it('should return null', async () => {
      const mockImplementationFunction = jest.fn().mockImplementation(async () => {
        return {
          id: 1,
          username: "wira",
          firstName: "wira",
          lastName: "zeta",
          email: "wira@gmail.com",
          password: "123456",
          phoneNumber: "1234567890",
          image: null,
          createdAt: null,
          deletedAt: null,
          updatedAt: null
        }
      });

      prismaMock.users.findFirst.mockImplementation(mockImplementationFunction);
      prismaMock.users.create.mockImplementation(mockImplementationFunction);
      const register = await service.signUp({
        id: 1,
        username: "wira",
        firstName: "wira",
        lastName: "zeta",
        email: "wira@gmail.com",
        password: "123456",
        phoneNumber: "1234567890",
        image: null,
        createdAt: null,
        deletedAt: null,
        updatedAt: null
      });
      expect(register).toBeNull();
    });
  });
  describe('SignInUser', () => {
    it('should return token', async () => {
      const mockImplementationFunction = jest.fn().mockImplementation(async (args) => {
        const { where } = args || {};
        if(where && where.username === "wira"){
          return {
            id: 1,
            password: "$2a$10$T4o8EbnJwW.C6LFElprKaOL4BtpsUGf42fWla4AYxFd50ncDoasby",
          }  
        }
        return null;
      });
      prismaMock.users.findFirst.mockImplementation(mockImplementationFunction);
      const login = await service.signIn('wira', '123456');
      expect(login.length).toBeGreaterThanOrEqual('hello'.length);
    });
  });
});
