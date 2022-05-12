import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Visitor } from "./schema/visitor.schema";
import { VisitorService } from "./visitor.service";
import {Model} from "mongoose";

describe("VisitorService", () => {
    let service: VisitorService;
    let model: Model<Visitor>;
    let visitorModelMock={
         find:jest.fn(()=>({
        exec: jest.fn(()=>({data:[]}))
    })),
    create:jest.fn(()=>({data:{}})),

    }

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
