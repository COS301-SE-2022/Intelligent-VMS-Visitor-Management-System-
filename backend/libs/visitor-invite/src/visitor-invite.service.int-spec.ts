import { Test, TestingModule } from "@nestjs/testing";
import { ParkingService } from "@vms/parking";
import { VisitorInviteService } from "./visitor-invite.service";

describe('VisitorInviteService Int', () => {
    let service: VisitorInviteService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VisitorInviteService,
                ParkingService
            ],
        }).compile();

        await module.init()

        service = module.get<VisitorInviteService>(VisitorInviteService);
    });

    it.todo('write more int tests');
})