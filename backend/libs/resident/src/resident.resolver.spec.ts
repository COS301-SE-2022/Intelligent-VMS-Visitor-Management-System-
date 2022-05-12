import { Test, TestingModule } from "@nestjs/testing";
import { QueryBus } from "@nestjs/cqrs";
import { ResidentResolver } from "./resident.resolver";
import { AuthService } from "../../auth/src/auth.service";
describe("ResidentResolver", () => {
    let resolver: ResidentResolver;
    let service:AuthService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ResidentResolver, QueryBus],
        }).compile();

        resolver = module.get<ResidentResolver>(ResidentResolver);
    });

    it("should be defined", () => {
        //expect(mockUserModel).toBeDefined();
        expect(resolver).toBeDefined();
    });
});