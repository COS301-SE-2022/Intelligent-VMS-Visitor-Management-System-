import { Test, TestingModule } from "@nestjs/testing";
import { CACHE_MANAGER } from "@nestjs/common";
import { CommandBus, ICommand, IQuery, QueryBus } from "@nestjs/cqrs";
import { ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { VisitorInviteService } from "./visitor-invite.service";
import { GetInvitesQuery } from "./queries/impl/getInvites.query";
import { GetNumberVisitorQuery } from "./queries/impl/getNumberOfVisitors.query";
import { GetInvitesInRangeQuery } from "./queries/impl/getInvitesInRange.query";
import { GetNumberOfInvitesOfResidentQuery } from "./queries/impl/getNumberOfInvitesOfResident.query";

import { UserService } from "@vms/user";
import { MailService } from "@vms/mail";
import { ParkingService } from "@vms/parking/parking.service";
import { RestrictionsService } from "@vms/restrictions/restrictions.service";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ExtendInvitesCommand } from "./commands/impl/extendInvites.command";
import { CronJob } from "cron";
import { RewardsService } from "@vms/rewards";
import { GetNumberOfCancellationsOfResidentQuery } from "./queries/impl/getNumberOfCancellationsOfResident.query";
import { GetInvitesOfResidentQuery } from "./queries/impl/getInvitesOfResident.query";
import { GetInvitesInRangeByEmailQuery } from "./queries/impl/getInvitesInRangeByEmail.query";
import { GetInviteForSignInDataQuery } from "./queries/impl/getInviteForSignInData.query";
import { GetInviteForSignOutDataQuery } from "./queries/impl/getInviteForSignOutData.query";
import { GetInviteForSignQuery } from "./queries/impl/getInviteForSign.query";
import { GetNumberOfVisitsOfResidentQuery } from "./queries/impl/getNumberOfVisitsOfResident.query";
import { GetInvitesForUsersQuery } from "./queries/impl/getInvitesForUsers.query";
import { GetVisitorVisitsQuery } from "./queries/impl/getVisitorVisits.query";
import { GetInvitesByDateQuery } from "./queries/impl/getInvitesByDate.query";
import { CreateGroupInviteCommand } from "./commands/impl/createGroupInvite.command";

describe("VisitorInviteService", () => {
    let service: VisitorInviteService;
    let userService:UserService;
    const commandBusMock = {
        execute: jest.fn((command: ICommand) => {
            if(command instanceof ExtendInvitesCommand){
                return 2300
            }else if (command instanceof CreateGroupInviteCommand) {
                return 0
            }
        }),
    };
    
    const queryBusMock = {
        execute: jest.fn((query: IQuery) => {
            if (query instanceof GetInvitesQuery) {
                if (query.email === "admin@mail.com") {
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
            } else if (query instanceof GetNumberVisitorQuery) {
                return 898;
            } else if (query instanceof GetInvitesInRangeQuery) {
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
            } else if (query instanceof GetNumberOfInvitesOfResidentQuery) {
                if (query.email === "admin@mail.com") {
                    return 2;
                } else {
                    return 0;
                }
            }else if (query instanceof GetNumberOfCancellationsOfResidentQuery) {
                if (query.email === "admin@mail.com") {
                    return 2;
                } else {
                    return 0;
                }
            }else if (query instanceof GetInvitesForUsersQuery) {
               
                    return 12;
                
            }else if (query instanceof GetInviteForSignInDataQuery) {
                if (query.idNumber === "9911305129086") {
                    return 2;
                } else {
                    return 0;
                }
            }else if (query instanceof GetVisitorVisitsQuery) {
                if (query.email === "Steffanny") {
                    return [{visits:[['Sept 28, 22 13:20:18'],['Sept 29, 22 13:20:18']],visitorName:"dan",_id:"999",idNumber:"999",idDocType:"paper",numInvites:3},{visits:[['Sept 28, 22 13:20:18'],['Sept 29, 22 13:20:18']],visitorName:"dan",_id:"999",idNumber:"999",idDocType:"paper",numInvites:3}];
                } else {
                    return 0;
                }
            }else if (query instanceof GetInviteForSignOutDataQuery) {
                if (query.idNumber === "9911305129086") {
                    return 1;
                } else {
                    return 0;
                }
            }else if (query instanceof GetInviteForSignQuery) {
                if (query.idNumber === "9911305129086") {
                    return 3;
                } else {
                    return 0;
                }
            }else if (query instanceof GetNumberOfVisitsOfResidentQuery) {
                if (query.email === "Joe@gmail.com") {
                    return 6;
                } else {
                    return 0;
                }
            }else if (query instanceof GetInvitesOfResidentQuery) {
                if (query.email === "admin@mail.com") {
                    return [{inviteState:"extended"},{inviteState:"extended"}];
                } else {
                    return 0;
                }
            }else if (query instanceof GetInvitesByDateQuery) {
                
                    return [{length:9,inviteState:"signedOut"}];
                
            }else if (query instanceof GetInvitesInRangeByEmailQuery) {
                if (query.email === "admin@mail.com") {
                    return [{inviteState:"extended"},{inviteState:"extended"}];
                } else if (query.email === "myman@male.com") {
                    return 5;
                } else {
                    return 0;
                }
            }
        }),
    };

    const mailServiceMock = {
        sendInvite: jest.fn(() => {return { messageId: 'id' }}),
        sendCancelNotice: jest.fn(() => {return { messageId: 'id' }}),
    };

    const parkingServiceMock = {
        isParkingAvailable: jest.fn(() => {return true}),
        reserveParking: jest.fn(() => {return {}}),
        unreserveParking: jest.fn(() => {return {}}),
    };

    const scheduleMock = {
        addCronJob: jest.fn(()=>{return {}}),
        deleteCronJob: jest.fn(()=>{return {}}),
    };

    // jest.mock('cron', () => {
    //     const actual = jest.requireActual('cron');
    //     return {
    //         ...actual,
    //         CronJob: jest.fn().mockReturnValue({
    //             start: jest.fn(() => {})
    //         }),
    //     }
    // });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule],
            providers: [
                VisitorInviteService,
                UserService,
                ParkingService,
                ConfigService,
                MailService,
                RestrictionsService,
                RewardsService,
                { provide: CronJob, useValue: {
                    start: ()=>{console.log("j")}
                }},
                { provide: SchedulerRegistry, useValue: scheduleMock},
                { provide: ParkingService, useValue: parkingServiceMock },
                { provide: CommandBus, useValue: commandBusMock },
                { provide: MailService, useValue: mailServiceMock },
                {
                    provide: QueryBus, useValue: queryBusMock
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: () => { return 'any value' },
                        set: () => { return jest.fn() },
                    },
                },
            ],
        }).compile();

        await module.init()
        userService = module.get<UserService>(UserService);
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

    describe("getTotalNumberOfCancellationsOfResident", () => {
        it("should return the number of invites cancelled by resident", async () => {
            const numCancels = await service.getTotalNumberOfCancellationsOfResident("admin@mail.com");
            expect(numCancels).toEqual(2);
        });
    });
     describe("getTotalNumberOfSleepoversOfResident", () => {
        it("should return the number of sleepovers of the resident", async () => {
            const numSleepovers = await service.getTotalNumberOfSleepoversOfResident("admin@mail.com");
            expect(numSleepovers).toEqual(2);
        });
    });
    describe("getTotalNumberOfSleepoversThisMonthOfResident", () => {
        it("should return the number of sleepovers of the resident for this month", async () => {
            const numSleepovers = await service.getTotalNumberOfSleepoversThisMonthOfResident("admin@mail.com");
            expect(numSleepovers).toEqual(2);
        });
    });

    describe('createInvite', () => {
        it('should create an invite where numInvitesSent < numInvitesAllowed', async () => {
            // Arrange
            jest.spyOn(commandBusMock as any, 'execute').mockReturnValueOnce(1)
            jest.spyOn(commandBusMock as any, 'execute').mockReturnValueOnce(5)

            // Act
            const response = await service.createInvite(2, 'email@email.com', 'visitor@email.com', 'visitor', 'id', '123123123123123', 'yesterday', true, false);
            // Assert
            expect(response).toEqual('id')

        })
        it('should not create an invite where there is no parking', async () => {
            // Arrange
            parkingServiceMock.isParkingAvailable.mockReturnValueOnce(false)
            jest.spyOn(commandBusMock as any, 'execute').mockReturnValueOnce(1)
            jest.spyOn(commandBusMock as any, 'execute').mockReturnValueOnce(5)
            try {
                // Act
                const response = await service.createInvite(2, 'email@email.com', 'visitor@email.com', 'visitor', 'id', '123123123123123', 'yesterday', true, false);
            } catch (e) {
                // Assert
                expect(e.message).toEqual('Parking not available')
            }

        })
        it('should not create an invite where numInvitesSent >= numInvitesAllowed', async () => {
            // Arrange
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce(30)
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce(50)

            // Act
            try {
                const response = await service.createInvite(2, 'email@email.com', 'visitor@email.com', 'visitor', 'id', '123123123123123', 'yesterday', false, false);
                expect(true).toEqual(false);
            }
            catch (e) {
                expect(e.message).toEqual('Max Number of Invites Sent')
            }
            // Assert

        })
    })

    describe('createInviteForBulkSignIn', () => {
        it('should create bulk invite', async () => {
            // Arrange
            jest.spyOn(commandBusMock as any, 'execute').mockReturnValueOnce(1)
            jest.spyOn(commandBusMock as any, 'execute').mockReturnValueOnce(5)

            // Act
            const response = await service.createInviteForBulkSignIn(3, 'user', 'visitor', 'name', 'id', 'ads', 'a', true)

            // Assert
            expect(response).toBeTruthy()

        })
        it('should not create bulk invite where numInvitesSent >= numInvitesAllowed', async () => {
            // Arrange
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce(30)
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce(50)

            // Act
            try {
                const response = await service.createInviteForBulkSignIn(2, 'email@email.com', 'visitor@email.com', 'visitor', 'id', '123123123123123', 'yesterday', false);
                expect(true).toEqual(false);
            }
            catch (e) {
                expect(e.message).toEqual('Max Number of Invites Sent')
            }
            // Assert

        })
    })

    describe('getInvite', () => {
        it('should get invite', async () => {
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce(30)
            const response = await service.getInvite('id');
            expect(response).toEqual(30)

        })
        it('should throw no invite given error', async () => {
            //jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce(30)
            try {
                const response = await service.getInvite("");
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("No invite given");
            }
        })
        it('should throw no invite with that id error', async () => {
            //jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce(30)
            try {
                const response = await service.getInvite("12");
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("Invite not found with id");
            }
        })
    })

    describe('getInvites', () => {
        it('should get invites', async () => {
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce(30)
            const response = await service.getInvites('id');
            expect(response).toEqual(30)

        })

        
    })


    describe('cancel invite', () => {
        it('should cancel invite', async () => {
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce({ userEmail: 'mail' })
            jest.spyOn(commandBusMock as any, 'execute').mockReturnValueOnce({ userEmail: 'mail' })
            const response = await service.cancelInvite('mail', 'id');
            expect(response).toEqual(1)

        })
        it('should not cancel invite when email dont match', async () => {
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce({ userEmail: 'mail' })
            jest.spyOn(commandBusMock as any, 'execute').mockReturnValueOnce({ userEmail: 'mail' })
            try { const response = await service.cancelInvite('email', 'id'); }
            catch (e) { expect(e.message).toEqual('Invite was not issued by: email') }

        })
        it('should not cancel invite when invite not found', async () => {
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce(null)
            jest.spyOn(commandBusMock as any, 'execute').mockReturnValueOnce({ userEmail: 'mail' })
            try { const response = await service.cancelInvite('email', 'id'); }
            catch (e) { expect(e.message).toEqual('Invite not found with ID: id') }

        })
    })

    describe('getNumberOfOpenInvites', () => {
        it('should getNumberOfOpenInvites', async () => {
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce({})

            const response = await service.getNumberOfOpenInvites('m')

            expect(response).toEqual({})
        })
    })

    describe('getInvitesByDate', () => {
        it('should getInvitesByDate', async () => {
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce({})

            const response = await service.getInvitesByDate('m')

            expect(response).toEqual({})
        })
    })

    describe('getInvitesByName', () => {
        it('should getInvitesByName', async () => {
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce({})

            const response = await service.getInvitesByName('m')

            expect(response).toEqual({})
        })
    })

    describe('getInvitesByNameForSearch', () => {
        it('should getInvitesByNameForSearch', async () => {
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce({})

            const response = await service.getInvitesByNameForSearch('m')

            expect(response).toEqual({})
        })
    })

    describe('getInvitesByIDForReceptionistSearch', () => {
        it('should getInvitesByIDForReceptionistSearch', async () => {
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce({})

            const response = await service.getInvitesByIDForReceptionistSearch('m')

            expect(response).toEqual({})
        })
    })

    describe('getTotalNumberOfInvitesVisitor', () => {
        it('should getTotalNumberOfInvitesVisitor', async () => {
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce({})

            const response = await service.getTotalNumberOfInvitesVisitor('m')

            expect(response).toEqual({})
        })
    })

    describe('getVisitors', () => {
        it('should getVisitors', async () => {
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce({})

            const response = await service.getVisitors('m')

            expect(response).toEqual({})
        })
    })

    describe('getMostUsedInviteData', () => {
        it('should getMostUsedInviteData', async () => {
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce('hello world')

            const response = await service.getMostUsedInviteData('m')

            expect(response).toEqual({})
        })
    })

    describe('getMostUsedInviteData', () => {
        it('should getMostUsedInviteData', async () => {
            jest.spyOn(queryBusMock as any, 'execute').mockReturnValueOnce({})

            try { const response = await service.getMostUsedInviteData('') }

            catch (e) { expect(e.message).toEqual('No Invites to make suggestion') }
        })
    })
    describe('extendInvitesJob', () => {
        it('should extend invites', async () => {
           

            const response = await service.extendInvitesJob();
            expect(response).toBeTruthy;

        })
    })
    describe('setCurfewDetails', () => {
        it('should set Curfew Details', async () => {
            const response = await service.setCurfewDetails(3);
            expect(response).toBeTruthy;
        })
    })
    describe('getInviteForSignInData', () => {
        it('should get the invite needed for sign in', async () => {
            const response = await service.getInviteForSignInData("9911305129086", "2022/09/22", "true");
            expect(response).toEqual(2);
        })
    })
    describe('getInviteForSignOutData', () => {
        it('should get the invite needed for sign in', async () => {
            const response = await service.getInviteForSignOutData("9911305129086");
            expect(response).toEqual(1);
        })
    })
    describe('getInviteForSign', () => {
        it('should get the invite needed for sign in', async () => {
            const response = await service.getInviteForSign("9911305129086");
            expect(response).toEqual(3);
        })
    })
    describe('getNumInvitesPerDateOfUser', () => {
        it('should get the visits for the day of the user', async () => {
            const response = await service.getNumInvitesPerDateOfUser("2022/09/22", "2022/09/23", "myman@male.com");
            expect(response).toEqual(5);
        })
    })
    describe('getTotalNumberOfVisitsOfResident', () => {
        it('should get the total number of visits the resident has had', async () => {
            const response = await service.getTotalNumberOfVisitsOfResident( "Joe@gmail.com");
            expect(response).toEqual(6);
        })
    })
    describe('getInvitesForUserType', () => {
        it('should get the total number of visits the resident has had', async () => {
            const findOneMock=jest.spyOn(userService, "getUsersByType").mockReturnValueOnce(Promise.resolve( [{email:"dorithy"}]));
            const response = await service.getInvitesForUserType( 3);
            expect(response).toEqual(12);
        })
        it('should return an empty list', async () => {
            const findOneMock=jest.spyOn(userService, "getUsersByType").mockReturnValueOnce(Promise.resolve( []));
            const response = await service.getInvitesForUserType( 3);
            expect(response).toEqual([]);
        })
    })
    describe('getMonthsBetweenDates', () => {
        it('should get the months between the two dates', async () => {
            const date1 = new Date('Sept 24, 22 13:20:18')
            const date2 = new Date('Sept 28, 22 13:20:18');
            const response = await service.getMonthsBetweenDates(date1, date2);
            expect(response).toEqual(0);
        })
    })
    describe('getDaysBetweenDates', () => {
        it('should get the days between the two dates', async () => {
            const date1 = new Date('Sept 24, 22 13:20:18')
            const date2 = new Date('Sept 28, 22 13:20:18');
            const response = await service.getDaysBetweenDates(date1, date2);
            expect(response).toEqual(4);
        })
    })
    describe('getWeekdayBetweenDates', () => {
        it('should get the days between the two dates', async () => {
            const date1 = new Date('Sept 28, 22 13:20:18')
            const date2 = new Date('Sept 28, 22 13:20:18');
            const response = await service.getWeekdayBetweenDates(date1, date2);
            expect(response).toEqual(0);
        })
    })
    describe('getSuggestions', () => {
        it('should get suggestions', async () => {
            const response = await service.getSuggestions('Sept 28, 22 13:20:18', "Steffanny");
            expect(response).toEqual([{"_id": "999", "idDocType": "paper", "idNumber": "999", "prob": -Infinity, "visitorName": "dan"}, {"_id": "999", "idDocType": "paper", "idNumber": "999", "prob": -Infinity, "visitorName": "dan"}]);
        })
    })
    describe('groupInvites', () => {
        it('should get all the group invites', async () => {
            const response = await service.groupInvites();
            expect(response).toBeFalsy;
        })
    })
    
});