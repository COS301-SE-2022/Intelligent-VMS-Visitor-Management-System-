import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Visitor } from "./schema/visitor.schema";
import { VisitorService } from "./visitor.service";

describe("VisitorService", () => {
    let service: VisitorService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VisitorService,
                { provide: getModelToken(Visitor.name), useValue: jest.fn() },
            ],
        }).compile();

        service = module.get<VisitorService>(VisitorService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
