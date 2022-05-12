import { Test, TestingModule } from "@nestjs/testing";
import { QueryBus } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";

import { UserService } from "./user.service";
import { User, UserDocument } from "./schema/user.schema";

describe("UserService", () => {
    let service: UserService;
    let mockUserModel: Model<UserDocument>;
    const queryBusMock = {
        execute: jest.fn(() => ({data: 'email'}))
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken(User.name),
                    useValue: Model,
                },
                UserService,
                {provide: QueryBus, useValue: queryBusMock},
            ],
        }).compile();

        mockUserModel = module.get<Model<UserDocument>>(
            getModelToken(User.name),
        );

        service = module.get<UserService>(UserService);
    });

    it("should be defined", () => {
        expect(mockUserModel).toBeDefined();
        expect(service).toBeDefined();
    });
     describe("findOne()", () => {
        it("should find one", async() => {
            // Act
            const resp = await service.findOne('tab@email.com');
            // Assert
            expect(resp).toEqual({data: 'email'});
            expect(queryBusMock.execute).toHaveBeenCalledTimes(1);
        })
    })   
    
});