import { Test, TestingModule } from "@nestjs/testing";
import { QueryBus, IQuery, CommandBus } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";

import { UserService } from "./user.service";
import { User, UserDocument } from "./schema/user.schema";
import { GetUserQuery } from "./queries/impl/getUser.query";
import { GetUnAuthUsersQuery } from "./queries/impl/getUnAuthUsers.query";
import { RewardsService } from "@vms/rewards";
import { RestrictionsService } from "@vms/restrictions";
import { VisitorInviteService } from "@vms/visitor-invite";
import { ConfigService } from "@nestjs/config";
import { MailService } from "@vms/mail";
import { CACHE_MANAGER } from "@nestjs/common";
import { ParkingService } from "@vms/parking";
import { SchedulerRegistry } from "@nestjs/schedule";

describe("UserService", () => {
    let service: UserService;
    let mockUserModel: Model<UserDocument>;
    const queryBusMock = {
        execute: jest.fn((query: IQuery) => {
            if(query instanceof GetUserQuery) {
                return { data: "email" };
            } else if(query instanceof GetUnAuthUsersQuery) {
                if(query.permission === -1) {
                    return [
                        {
                            email: "unauthreceptionist@mail.com",
                            password: "hashed",
                            permission: -1,
                        }, 
                        {
                            email: "unauthreceptionist@mail.com",
                            password: "hashed",
                            permission: -2,
                        }, 
                    ];
                } else if(query.permission === -2) {
                    return [
                        {
                            email: "unauthreceptionist@mail.com",
                            password: "hashed",
                            permission: -1,
                        }, 
                    ];
                }                               
            }
        })
    }

    const scheduleMock = {
        addCronJob: jest.fn(()=>({})),
        deleteCronJob: jest.fn(()=>({})),
      };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule],
            providers: [
                {
                    provide: getModelToken(User.name),
                    useValue: Model,
                },
                UserService,
                RewardsService,
                RestrictionsService,
                VisitorInviteService,
                ConfigService,
                ParkingService,
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: () => {return 'any value'},
                        set: () => {return jest.fn()},
                    },
                },
                { provide: SchedulerRegistry, useValue: scheduleMock},
                MailService,
                {provide: QueryBus, useValue: queryBusMock},
                CommandBus
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

    describe("findOne", () => {
        it("should find one", async () => {
            // Act
            const resp = await service.findOne("tab@mail.com");
            // Assert
            expect(resp).toEqual({data: 'email'});
            expect(queryBusMock.execute).toHaveBeenCalledTimes(1);
        })
    });   

    describe("getUnAuthorizedUsers", () => {
        it("should get unauthorized resident and receptionist when user is admin", async () => {
            const userData = await service.getUnAuthorizedUsers(0);

            expect(userData.length).toEqual(2);
        });

        it("should get unauthorized resident when user is receptionist", async () => {
            const userData = await service.getUnAuthorizedUsers(1);
            expect(userData.length).toEqual(1);
        });

    });
    
});
