import { Test, TestingModule } from "@nestjs/testing";
import { QueryBus } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";

import { UserService } from "./user.service";
import { User, UserDocument } from "./schema/user.schema";

describe("UserService", () => {
    let service: UserService;
    let mockUserModel: Model<UserDocument>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken(User.name),
                    useValue: Model,
                },
                UserService,
                QueryBus,
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
});
