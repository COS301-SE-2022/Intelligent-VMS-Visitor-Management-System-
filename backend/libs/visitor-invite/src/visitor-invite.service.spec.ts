import { Test, TestingModule } from "@nestjs/testing";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { VisitorInviteService } from "./visitor-invite.service";

describe("VisitorInviteService", () => {
    let service: VisitorInviteService;
    let command: CommandBus;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VisitorInviteService, CommandBus, QueryBus],
        }).compile();

        await module.init()

        service = module.get<VisitorInviteService>(VisitorInviteService);
        command = module.get<CommandBus>(CommandBus);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(command).toBeDefined();
    });

});
