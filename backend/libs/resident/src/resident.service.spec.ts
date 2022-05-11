import { Test, TestingModule } from "@nestjs/testing";
import { QueryBus } from "@nestjs/cqrs";
import { ResidentService } from "./resident.service";

describe("ResidentService", () => {
    let service: ResidentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ResidentService, QueryBus],
        }).compile();

        service = module.get<ResidentService>(ResidentService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
