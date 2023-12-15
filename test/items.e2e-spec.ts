import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ItemsService } from '../src/items/items.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthGuardGuard } from '../src/guard/auth-guard/auth-guard.guard';

describe("ItemsController (e2e)", () => {
    let app: INestApplication;
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            providers: [PrismaService, ItemsService]
        }).overrideGuard(AuthGuardGuard).useValue('').compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });
    it('/ (GET)', () => {
        request(app.getHttpServer).get('items').then((value) => {
            console.log(value);
        });
        // return request(app.getHttpServer).get('items');
    });
});