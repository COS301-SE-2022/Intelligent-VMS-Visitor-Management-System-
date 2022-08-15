import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UserService } from "@vms/user";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { CACHE_MANAGER } from "@nestjs/common";

import { LoginFailed } from "./errors/loginFailed.error";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "@vms/user/schema/user.schema";
import {GetUserQuery} from "@vms/user/queries/impl/getUser.query";
import {MailService} from "@vms/mail";

describe("AuthService", () => {
    let service: AuthService;
    let userService: UserService;
    let jwtService: JwtService;
    let queryBus: QueryBus;
    let mockUserModel: Model<UserDocument>;
    let cache: Cache;
    let MailService={
         sendVerify: jest.fn(()=>({})),

    };
    const cacheMock={
        get: jest.fn(async()=>{
            return 'any value'
        }),
    }

    const queryBusMock = {
        execute: jest.fn((query) => {
            return {
                email: "admin@mail.com",
                password: "password"
            };
        })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, 
                JwtService, 
                UserService, 
                ConfigService,
                CommandBus,
                {
                  provide: QueryBus,
                  useValue: queryBusMock
                },
                {
                    provide: getModelToken(User.name),
                    useValue: Model,
                },
                {
                      provide: CACHE_MANAGER,
                      useValue: {
                        get: () => {return 'any value'},
                        set: () => {return jest.fn()},
                    },
                },
                MailService,
            ],
        })
            .useMocker((token) => {
                if (token.toString() === "JWT_MODULE_OPTIONS") {
                    return {
                        secret: "test",
                        signOptions: { expiresIn: "60s" },
                    };
                }
                return null;
            })
            .compile();

        service = module.get<AuthService>(AuthService);
        queryBus = module.get<QueryBus>(QueryBus);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
        mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));
        cache = module.get<Cache>(CACHE_MANAGER);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(jwtService).toBeDefined();
        expect(queryBus).toBeDefined();
        expect(mockUserModel).toBeDefined();
    });

    describe("Login", () => {
        it("should return an access token on valid user data", async () => {
            jest.spyOn(userService, "findOne").mockImplementation(async (email: string) => {
                if(email === "admin@mail.com") {
                    return {
                        email: "admin@mail.com",
                        password: "password"
                    };
                } else {
                    return undefined;
                }
            }); 

            jest.spyOn(service, "validateUser").mockImplementation(
                async (email: string, password: string) => {
                    return true;
                },
            );

            const payload = await service.login({email: "admin@mail.com", password: "password"});
            expect(payload).toHaveProperty("access_token");
        });
    });

    describe("validateUser", () => {

        it("should return a user object on valid user data", async () => {
            const bcryptCompare = jest.fn().mockResolvedValue(true);
            (bcrypt.compare as jest.Mock) = bcryptCompare;
            
            jest.spyOn(userService, "findOne").mockImplementation(async (email: string) => {
                if(email === "admin@mail.com") {
                    return {
                        email: "admin@mail.com",
                        password: "password",
                        permission: 0
                    }
                } else {
                    return undefined;
                }
            });

            const user = await service.validateUser(
                "admin@mail.com",
                "password",
            );

            expect(user).toBeDefined();
            expect(user).toHaveProperty("email");
            expect(user).toHaveProperty("password");
            expect(user.email).toEqual("admin@mail.com");
        });

        it("should throw an exception on invalid user email", async () => {
            const bcryptCompare = jest.fn().mockResolvedValue(true);
            (bcrypt.compare as jest.Mock) = bcryptCompare;
            
            jest.spyOn(userService, "findOne").mockImplementation(async (email: string) => {
                if(email === "admin@mail.com") {
                    return {
                        email: "admin@mail.com",
                        password: "password",
                        permission: 0
                    }
                } else {
                    return undefined;
                }
            });

            try {
                await service.validateUser("error@mail.com", "password");
            } catch(err) {
                expect(err).toBeDefined();
                expect(err.message).toEqual("User not found");
            }
        });

        it("should throw an exception on invalid user password", async () => {
            const bcryptCompare = jest.fn().mockResolvedValue(false);
            (bcrypt.compare as jest.Mock) = bcryptCompare;
            
            jest.spyOn(userService, "findOne").mockImplementation(async (email: string) => {
                if(email === "admin@mail.com") {
                    return {
                        email: "admin@mail.com",
                        password: "password",
                        permission: 0
                    }
                } else {
                    return undefined;
                }
            });

            try {
                await service.validateUser("admin@mail.com", "password");
            } catch(err) {
                expect(err).toBeDefined();
                expect(err.message).toEqual("Incorrect Password");
            }
        });

    });
});
