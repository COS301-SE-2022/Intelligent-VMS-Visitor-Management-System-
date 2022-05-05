import { CommandBus } from "@nestjs/cqrs";
import { Test, TestingModule } from "@nestjs/testing";
import { VisitorInviteService } from "./visitor-invite.service";

describe("VisitorInviteService", () => {
    let service: VisitorInviteService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VisitorInviteService, CommandBus],
        }).compile();

        service = module.get<VisitorInviteService>(VisitorInviteService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
