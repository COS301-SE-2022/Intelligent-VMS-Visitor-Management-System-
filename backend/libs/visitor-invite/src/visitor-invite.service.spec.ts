import { Test, TestingModule } from "@nestjs/testing";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { VisitorInviteService } from "./visitor-invite.service";
import { Invite } from "./models/invite.model";
import { CreateInviteCommandHandler } from "../src/commands/handlers/createInviteCommand.handler";


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

    it('valid information does not generate an invite', async () => {    
       const s = service.createInvite("receptionist@mail.com", "melis@mail.com", "RSA-ID", "0012120178087");
       expect((await s)).toBe(true);
    });
});
