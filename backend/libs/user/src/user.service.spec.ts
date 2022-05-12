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

   
    
});