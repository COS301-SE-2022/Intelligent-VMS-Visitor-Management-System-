import { Test, TestingModule } from "@nestjs/testing";
import { CommandBus, IQuery, QueryBus } from "@nestjs/cqrs";
import { ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { VisitorInviteService } from "./visitor-invite.service";
import { GetInvitesQuery } from "./queries/impl/getInvites.query";
import { GetNumberVisitorQuery } from "./queries/impl/getNumberOfVisitors.query";
import { GetInvitesInRangeQuery } from "./queries/impl/getInvitesInRange.query";
import {GetNumberOfInvitesOfResidentQuery} from "./queries/impl/getNumberOfInvitesOfResident.query";

import {MailService} from "@vms/mail";
import { ParkingService } from "@vms/parking/parking.service";
import { RestrictionsService } from "@vms/restrictions/restrictions.service";

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
                            inviteDate: "2022-06-21",
                            requiresParking: true
                        },
                        {
                            visitorEmail: "visitor2@mail.com",
                            residentEmail: "admin@mail.com",
                            idDocType: "RSA-ID",
                            idNumber: "0109195283090",
                            inviteID: "fej1-33ft-334f-99fd",
                            inviteDate: "2022-05-21",
                            requiresParking: false
                        }
                    ]
                } else {
                    return [];
                }
            } else if(query instanceof GetNumberVisitorQuery) {
                return 898;
            } else if(query instanceof GetInvitesInRangeQuery) {
                return [
                    {
                        visitorEmail: "visitor@mail.com",
                        residentEmail: "admin@mail.com",
                        idDocType: "RSA-ID",
                        idNumber: "0109195283090",
                        inviteID: "fej1-23d3-334f-99fd",
                        inviteDate: "2022-06-21",
                        requiresParking: true
                    },
                    {
                        visitorEmail: "visitor2@mail.com",
                        residentEmail: "admin@mail.com",
                        idDocType: "RSA-ID",
                        idNumber: "0109195283090",
                        inviteID: "fej1-33ft-334f-99fd",
                        inviteDate: "2022-05-21",
                        requiresParking: false
                    }
                ];
            } else if(query instanceof GetNumberOfInvitesOfResidentQuery) {
                if(query.email === "admin@mail.com") {
                    return 2;
                } else {
                    return 0;
                }
            }
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule],
            providers: [
                VisitorInviteService, 
                ParkingService,
                ConfigService,
                MailService,
                RestrictionsService,
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
            expect(invites[0]).toHaveProperty("inviteDate");
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

    describe("getNumInvitesPerDate", () => {
        it("should return an array of dates corresponding to given range", async () => {
            const invites = await service.getNumInvitesPerDate("2022-04-01", "2022-09-01");
            expect(invites.length).toEqual(2);
        });

        it("should throw an error when the start date is later than the end date", async () => {
            try {
                const invites = await service.getNumInvitesPerDate("2022-12-01", "2021-11-02");
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("Start date can not be later than the end date");
            }
        });

        it("should throw an error when the start date has an invalid date format", async () => {
            try {
                const invites = await service.getNumInvitesPerDate("", "2022-09-01");
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("Given Date is not of the form yyyy-mm-dd");
            }
        });

        it("should throw an error when the end date has an invalid date format", async () => {
            try {
                const invites = await service.getNumInvitesPerDate("2022-09-01", "");
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("Given Date is not of the form yyyy-mm-dd");
            }
        });

        it("should throw an error when the start and end date have an invalid date format", async () => {
            try {
                const invites = await service.getNumInvitesPerDate("dwdw", "");
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("Given Date is not of the form yyyy-mm-dd");
            }
        });

    });

    describe("GetTotalNumberOfInvitesOfResident", () => {
        it("should return the number of invites per resident", async () => {
            const numInvites = await service.getTotalNumberOfInvitesOfResident("admin@mail.com");
            expect(numInvites).toEqual(2);
        });
    });

});
