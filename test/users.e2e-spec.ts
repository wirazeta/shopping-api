import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { UsersService } from '../src/users/users.service';

describe("Auth Controller (e2e)", () => {
    let app: INestApplication;
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test
            .createTestingModule({
                imports: [AppModule],
                providers: [PrismaService, UsersService]
            }).compile()
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    describe("Create User", () => {
        // it("should create a new user", async () => {
        //     const req = request(app.getHttpServer)
        //         .post("/auth/register")
        //         .send(
        //             {
        //                 "username": "wira6",
        //                 "firstName": "wira5",
        //                 "lastName": "",
        //                 "email": "wira@gmail.com",
        //                 "password": "123456",
        //                 "phoneNumber": "000000000000"
        //             }
        //         )
        //     console.log(req);
        // });
        it("should get all users", async () => {
            // const req = (await request(app.getHttpServer).post("/auth/register"))
            // .headers({"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoxLCJpYXQiOjE3MDI0NTA1MTh9.XFy8_nV01dVN1NuoKdIQpqk6Pp4Jv0iDXQJqQjbVUAs"})
            console.log("User e2e");
        })
    })
});