import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Visitor } from "./schema/visitor.schema";
import { VisitorService } from "./visitor.service";
import {Model} from "mongoose";

describe("VisitorService", () => {
    let service: VisitorService;
    let model: Model<Visitor>;
    const visitorModelMock={
         find:jest.fn(()=>{return {
        exec: jest.fn(()=>{return {data:[]}})
    }}),
    create:jest.fn(()=>{return {data:{}}}),

    }

    beforeEach(async () => {
        jest.restoreAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VisitorService, { provide: getModelToken(Visitor.name),useValue: visitorModelMock},
            ],
        }).compile();

        service = module.get<VisitorService>(VisitorService);
        model = module.get<Model<Visitor>>(getModelToken(Visitor.name));
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findAll()", () => {
        it("should find all", async () => {
        //Act
        const resp = await service.findAll();
        //Assert
        expect(resp).toEqual({data: []});
    })
});
describe("create()", () => {
    it('should create', async() => {
        //Act
        const resp = await service.create({} as any);
        //Assert
        expect(resp).toEqual({data: {}});
        })
    });

});
