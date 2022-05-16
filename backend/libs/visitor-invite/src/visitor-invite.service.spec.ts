import { Test, TestingModule } from "@nestjs/testing";
import { CommandBus, IQuery, QueryBus } from "@nestjs/cqrs";
import { VisitorInviteService } from "./visitor-invite.service";
import {GetInvitesQuery} from "./queries/impl/getInvites.query";
import {GetNumberVisitorQuery} from "./queries/impl/getNumberOfVisitors.query";
import {MailService} from "@vms/mail";

describe("VisitorInviteService", () => {
    let service: VisitorInviteService;

    const queryBusMock = {
        execute: jest.fn((query: IQuery) => {
            if(query instanceof GetInvitesQuery) {
                if(query.email === "admin@mail.com") {
                    return [
                        {
                            visitorEmail: "visitor@mail.com",
                            residentEmail: "admin@mail.com",
                            idDocType: "RSA-ID",
                            idNumber: "0109195283090",
                            inviteID: "fej1-23d3-334f-99fd",
                            requiresParking: true
                        },
                        {
                            visitorEmail: "visitor2@mail.com",
                            residentEmail: "admin@mail.com",
                            idDocType: "RSA-ID",
                            idNumber: "0109195283090",
                            inviteID: "fej1-33ft-334f-99fd",
                            requiresParking: false
                        }
                    ]
                } else {
                    return [];
                }
            } else if(query instanceof GetNumberVisitorQuery) {
                return 898;
            }
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VisitorInviteService, 
                MailService,
                CommandBus, 
                {
                    provide: QueryBus, useValue: queryBusMock
                },
            ],
        }).compile();

        await module.init()

        service = module.get<VisitorInviteService>(VisitorInviteService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getInvites", () => {
        it("should return invites of the current user", async () => {
            const user = {
                email: "admin@mail.com",
                permission: 0
            }

            const invites = await service.getInvites(user.email);

            expect(invites).toHaveLength(2);
            expect(invites[0]).toHaveProperty("visitorEmail");
            expect(invites[0]).toHaveProperty("residentEmail");
            expect(invites[0]).toHaveProperty("idDocType");
            expect(invites[0]).toHaveProperty("inviteID");
            expect(invites[0]).toHaveProperty("requiresParking");
        });

        it("should return an empty array when accessing invites for another user", async () => {
            const user = {
                email: "otheruser@mail.com",
                permission: 1
            }

            const invites = await service.getInvites(user.email);

            expect(invites).toHaveLength(0);
        });

    });

    describe("getTotalNumberOfVisitors", () => {
        it("should return total number open invites sent for building", async () => {
            const numInvitesSent = await service.getTotalNumberOfVisitors();
            expect(numInvitesSent).toEqual(898);
        });
    });

});
