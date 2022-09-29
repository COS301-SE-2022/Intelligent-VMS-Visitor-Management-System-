import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from "@nestjs/config";
import { CommandBus, IQuery, QueryBus } from "@nestjs/cqrs";
import { HttpModule } from "@nestjs/axios";
import { ParkingService } from './parking.service';
import { getTotalAvailableParkingQuery } from './queries/impl/getTotalAvailableParking.query';
import {FreeParkingCommand} from './commands/impl/freeParking.command';
import {AssignParkingCommand} from './commands/impl/assignParking.command';
import {ReserveParkingCommand} from './commands/impl/reserveParking.command';

import { UserService } from '@vms/user';
import { VisitorInviteService } from '@vms/visitor-invite';
import { MailService } from '@vms/mail/mail.service';
import { RestrictionsService } from "@vms/restrictions";

import { Parking } from './models/parking.model';
import { GetInviteQuery } from '@vms/visitor-invite/queries/impl/getInvite.query';
import { Invite } from '@vms/visitor-invite/schema/invite.schema';
import { GetInviteReservationQuery } from './queries/impl/getInviteReservation.query';
import { ParkingReservation } from './models/reservation.model';

import { GetParkingReservationsQuery } from './queries/impl/getParkingReservations.query';
import { AddParkingCommand } from './commands/impl/addParking.command';
import { CreateNParkingSpotsCommand } from './commands/impl/createNParkingSpots.command';
import { UnreserveParkingCommand } from './commands/impl/unreserveParking.command';
import { GetReservationsQuery } from './queries/impl/getReservations.query';
import { GetParkingQuery } from './queries/impl/getParking.query';
import { EnableParkingSpaceCommand } from './commands/impl/enableParkingSpace.command';
import { DisableParkingSpaceCommand } from './commands/impl/disableParkingSpace.command';
import { GetReservationsByDateQuery } from './queries/impl/getReservationsByDate.query';
import { GetNumberOfReservationsQuery } from './queries/impl/getNumberOfReservations.query';
import { GetReservationsByDateQueryHandler } from './queries/handlers/getReservationsByDateQuery.handler';
import { GetFreeParkingQuery } from './queries/impl/getFreeParking.query';
import { GetReservationsInRangeQuery } from './queries/impl/getReservationsInRange.query';
import { getAvailableParkingQuery } from './queries/impl/getAvailableParking.query';
import { getDisabledParkingQuery } from './queries/impl/getDisabledParking.query';
import { getTotalParkingQuery } from './queries/impl/getTotalParking.query';

import { CACHE_MANAGER } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { RewardsService } from '@vms/rewards';

describe('ParkingService', () => {
  let parkingService: ParkingService;
  let inviteService: VisitorInviteService;

  const queryBusMock = {
      execute: jest.fn((query: IQuery) => {
            if(query instanceof getTotalAvailableParkingQuery) {
                return 8;
            } else
            if(query instanceof getTotalParkingQuery) {
                return 8;
            } else
            if(query instanceof getAvailableParkingQuery) {
                const parkings = []
                let parking = new Parking();
                parking.parkingNumber=0;
                parking.visitorEmail="";
                parking.enabled=false;
                parkings[0] = parking;
                parking = new Parking();
                parking.parkingNumber=1;
                parking.visitorEmail="";
                parking.enabled=false;
                parkings[1] = parking;
                parking = new Parking();
                parking.parkingNumber=2;
                parking.visitorEmail="";
                parking.enabled=false;
                parkings[2] = parking;
                return 8;
            
            } else if(query instanceof GetInviteQuery){
                if(query.inviteID === "cb7c7938-1c41-427d-833e-2c6b77e0e26b")
                {
                    
                    const invite = new Invite();
                    invite.idDocType ="RSA-ID";
                    invite.idNumber = "0012120178087";
                    invite.userEmail = "admin@mail.com";
                    invite.inviteDate = "2022-05-14";
                    invite.visitorEmail = "larisabotha@gmail.com";
                    invite.inviteID = "cb7c7938-1c41-427d-833e-2c6b77e0e26b";

                    return invite;

                }else if(query.inviteID === "f11ae766-ce23-4f27-b428-83cff1afbf04")
                {
                    
                    const invite = new Invite();
                    invite.idDocType ="RSA-ID";
                    invite.idNumber = "0012120178087";
                    invite.userEmail = "admin@mail.com";
                    invite.inviteDate = "2022-05-15";
                    invite.visitorEmail = "larisabotha@icloud.com";
                    invite.inviteID = "f11ae766-ce23-4f27-b428-83cff1afbf04";

                    return invite;
                } else {
                    return undefined;
                }
            } else if(query instanceof GetInviteReservationQuery){
                if(query.invitationID === "f11ae766-ce23-4f27-b428-83cff1afbf04" )
                {
                    const reservation = new ParkingReservation();
                    reservation.parkingNumber= 0;
                    reservation.invitationID= "f11ae766-ce23-4f27-b428-83cff1afbf04";
                    reservation.reservationDate = "2022-05-15";
                    return reservation;
                } else 
                return undefined;
            } else if( query instanceof GetParkingQuery){
                if(query.parkingNumber === 2 )
                {
                    const parking = new Parking();
                    parking.parkingNumber=2;
                    parking.visitorEmail="";
                    parking.enabled=false;
                    return parking;
                } else if(query.parkingNumber === 1 )
                {
                    const parking = new Parking();
                    parking.parkingNumber=1;
                    parking.visitorEmail="";
                    parking.enabled=true;
                    return parking;
                } else if(query.parkingNumber === 0 )
                {
                    const parking = new Parking();
                    parking.parkingNumber=0;
                    parking.visitorEmail="";
                    parking.enabled=true;
                    return parking;
                } else
                return undefined;
                
            } else if(query instanceof GetParkingReservationsQuery){
                if(query.parkingNumber === 0 )
                {
                    const reservations = [];
                    const reservation = new ParkingReservation();
                    reservation.parkingNumber= 0;
                    reservation.invitationID= "f11ae766-ce23-4f27-b428-83cff1afbf04"
                    reservation.reservationDate = "2022-05-15";
                    reservations[0]=reservation;
                    return reservations;
                } else
                if(query.parkingNumber === 1 )
                {
                    const reservations = [];
                    const reservation = new ParkingReservation();
                    reservation.parkingNumber= 1;
                    reservation.invitationID= "abcc7938-2241-007d-333e-abc177e0e26b";
                    reservation.reservationDate = "2022-05-14";
                    reservations[0]=reservation;
                    return reservations;
                } else
                if(query.parkingNumber === 4 )
                {
                    const reservations = [];
                    let reservation = new ParkingReservation();
                    reservation.parkingNumber= 4;
                    reservation.invitationID= "abcc7938-2241-007d-333e-abc177e0e26b";
                    reservation.reservationDate = "2022-06-14";
                    reservations[0]=reservation;
                    reservation = new ParkingReservation();
                    reservation.parkingNumber= 4;
                    reservation.invitationID= "abcc7938-2241-007d-333e-abc177e0e26b";
                    reservation.reservationDate = "2022-03-12";
                    reservations[1]=reservation;
                    return reservations;
                } else
                return [];
                                
            } else if(query instanceof GetReservationsQuery){
                return [];
            } else if(query instanceof getDisabledParkingQuery){
                return [];
            } else if(query instanceof GetNumberOfReservationsQuery){
                return 4;
            } else if(query instanceof GetFreeParkingQuery){
                    const parkings = [];
                    let parking = new Parking();
                    parking.parkingNumber=0;
                    parking.visitorEmail="";
                    parking.enabled=true;
                    parkings[0] = parking;
                    parking = new Parking();
                    parking.parkingNumber=1;
                    parking.visitorEmail="";
                    parking.enabled=true;
                    parkings[1] = parking;
                    return parkings;

            } else if(query instanceof GetReservationsByDateQuery){
                    const reservations = [];
                    let reservation = new ParkingReservation();
                    reservation.parkingNumber= 1;
                    reservation.invitationID= "abcc7938-2241-007d-333e-abc177e0e26b";
                    reservation.reservationDate = "2022-05-14";
                    reservations[0]=reservation;
                    reservation = new ParkingReservation();
                    reservation.parkingNumber= 2;
                    reservation.invitationID= "f11ae766-ce23-4f27-b428-83cff1afbf04";
                    reservation.reservationDate = "2022-05-14";
                    reservations[1]=reservation;
                    return reservations;
                
            } else if(query instanceof GetReservationsInRangeQuery){
                const reservations = [];
                let reservation = new ParkingReservation();
                reservation.parkingNumber= 1;
                reservation.invitationID= "abcc7938-2241-007d-333e-abc177e0e26b";
                reservation.reservationDate = "2022-03-10";
                reservations[0]=reservation;
                reservation = new ParkingReservation();
                reservation.parkingNumber= 2;
                reservation.invitationID= "f11ae766-ce23-4f27-b428-83cff1afbf04";
                reservation.reservationDate = "2022-03-06";
                reservations[1]=reservation;
                return reservations;
            }
            
      }), 
  };

  const commandBusMock = {
      execute: jest.fn((command) => {
          if(command instanceof FreeParkingCommand) {
             if(command.parkingNumber === 0) {
                 const parking = new Parking();
                 parking.parkingNumber=0;
                 parking.visitorEmail="";
                 return parking;
             } else if(command.parkingNumber === 999){
                 return undefined; 
             }
          } else if(command instanceof AddParkingCommand) {
                const parking = new Parking();
                parking.parkingNumber=9;
                parking.visitorEmail="";
                return parking;
          } else if (command instanceof UnreserveParkingCommand){
                const parking = new Parking();
                parking.parkingNumber=0;
                parking.visitorEmail="";
                return parking;
          } else if ( command instanceof EnableParkingSpaceCommand){
            if(command.parkingNumber === 0) {
                const parking = new Parking();
                parking.parkingNumber=0;
                parking.visitorEmail="";
                parking.enabled=true;
                return parking;
            } else 
            return undefined;
        } else if ( command instanceof DisableParkingSpaceCommand){
            if(command.parkingNumber === 0) {
                const parking = new Parking();
                parking.parkingNumber=0;
                parking.visitorEmail="";
                parking.enabled=false;
                return parking;
            } else 
            return undefined; 
        } else if(command instanceof AssignParkingCommand) {
              if(command.parkingNumber === 0 && command.visitorEmail=="larisabotha@icloud.com") {
                    const parking = new Parking();
                    parking.parkingNumber=0;
                    parking.visitorEmail="larisabotha@icloud.com";
                    return parking;
              } else if(command.parkingNumber === 0 && command.visitorEmail=="larisabotha@gmail.com"){
                    const parking = new Parking();
                    parking.parkingNumber=0;
                    parking.visitorEmail="larisabotha@gmail.com";
                    return parking;
              } else {
                return undefined;
              }
          } else if(command instanceof CreateNParkingSpotsCommand) {
              if(command.numSpots === 3) {
                    const parkings = []
                    for(let i=0;i<3;i++)
                    {
                        const parking = new Parking();
                        parking.parkingNumber=10+i;
                        parking.visitorEmail="";
                        parkings[i]=parking;
                    }
                    return parkings;
              } else {
                return undefined;
              }
          } else if(command instanceof ReserveParkingCommand) {
              if(command.invitationID === "cb7c7938-1c41-427d-833e-2c6b77e0e26b") {
                const parking = new ParkingReservation();
                parking.parkingNumber=0;
                parking.invitationID = "cb7c7938-1c41-427d-833e-2c6b77e0e26b";
                return parking;
              } else if(command.parkingNumber === 0 && command.invitationID === "f11ae766-ce23-4f27-b428-83cff1afbf04") {
                const parking = new ParkingReservation();
                parking.parkingNumber=0;
                parking.invitationID = "f11ae766-ce23-4f27-b428-83cff1afbf04";
                return parking;
              }
          } else{
              return undefined;
          }
      }),
  };

  const scheduleMock = {
    addCronJob: jest.fn(()=>{return {}}),
    deleteCronJob: jest.fn(()=>{return {}}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [HttpModule],
        providers: [
            ParkingService, 
            VisitorInviteService,
            MailService,
            RestrictionsService,
            UserService,
            RewardsService,
            ConfigService,
            {
                provide: CACHE_MANAGER,
                useValue: {
                    get: () => {return 'any value'},
                    set: () => {return jest.fn()},
                },
            },
            { provide: SchedulerRegistry, useValue: scheduleMock},
            {
                provide: QueryBus, useValue: queryBusMock
            },
            {
                provide: CommandBus, useValue: commandBusMock
            }
        ],
    }).compile();

    parkingService = module.get<ParkingService>(ParkingService);
    inviteService = module.get<VisitorInviteService>(VisitorInviteService);
  });

  it('should be defined', () => {
    expect(parkingService).toBeDefined();
    expect(inviteService).toBeDefined();
  });

  //////////////////////////////////////////Functions

  describe("getTotalAvailableParking", () => {
        it("should return the number of unused parking spots", async () => {
            let amount = 0;
            try{
                amount = await parkingService.getTotalAvailableParking();
            } catch (error) {
            }
            expect(amount).toEqual(8);
        });    
  });

  describe("getFreeParking", () => {
    it("should return an array of parking spots that is not disabled nor being used ", async () => {
        let length = 0;
        const array = await parkingService.getFreeParking();
        length = array.length;
        expect(length).toEqual(2);
    });  
    
    it("should throw an exception if there are no parkings that are enabled and not being used", async () => {
       //TODO (Larisa) but not sure how
    });
});

  describe("freeParking", () => {
      it("should return valid parking if parking number is valid", async () => {
          let email = null;
          try{
          const parking = await parkingService.freeParking(0);
          email = parking.visitorEmail;
          } catch(error){}
          expect(email).toEqual("");
      });

      it("should throw an exception if an invalid parking number is given", async () => {
          const spaces = await parkingService.getTotalAvailableParking();
          try {
              await parkingService.freeParking(999);
          } catch (error) {
              expect(error).toBeDefined();
              expect(error.message).toEqual(`Parking number 999 is out of parking range. Parking range from 0 to `+spaces)
          }
      });
  });

  describe("addParking", () => {
    it("should return a new parking space", async () => {
        let parking;
        try{
        parking = await parkingService.addParking();
        } catch(error){}
        expect(parking).toBeDefined();
      });
  });

  describe("getDisabledParking", () => {
    it("should return a all disabled parking", async () => {
        expect(await parkingService.getDisabledParking()).toEqual([]);
      });
  });

  describe("isParkingAvailable", () => {
    it("should return true if available parking is more than the number of reserved parking", async () => {
        expect(await parkingService.isParkingAvailable()).toEqual(true);
      });
  });

  describe("getNumberOfReservations", () => {
    it("should return number of reservations", async () => {
        expect(await parkingService.getNumberOfReservations("2022-05-04")).toEqual(4);
      });

    it("should throw an exception if a date is of the wrong format", async () => {
        try {
            await parkingService.getNumberOfReservations("01-03-2022");
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual("Given dates must be of the form yyyy-mm-dd")
        }
    });
  });
  
  describe("createNParking", () => {
    it("should return array of the same length as input", async () => {
        let len;
        try{
            const parking = await parkingService.createNParkingSpots(3);
            expect(len).toEqual(3);
        } catch(error){}
    });

    it("should throw an exception if a negative input is given", async () => {
        try {
            await parkingService.createNParkingSpots(-5);
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual(`Cannot create -5 number of parking spots.`)
        }
    });
    });

  describe("assignParking", () => {
      it("should return valid parking if invitation ID is valid and reservation is made", async () => {
          const parking = await parkingService.assignParking("f11ae766-ce23-4f27-b428-83cff1afbf04");
          const invite = await inviteService.getInvite("f11ae766-ce23-4f27-b428-83cff1afbf04");
          expect(parking.visitorEmail).toEqual(invite.visitorEmail);
      });

      it("should throw an exception if invitation ID is valid but no reservation is made", async () => {
        try{
            await parkingService.assignParking("cb7c7938-1c41-427d-833e-2c6b77e0e26b");
        }catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual("Reservation for cb7c7938-1c41-427d-833e-2c6b77e0e26b not found");
        }
    });

      it("should throw an exception if an invalid invitation ID is given", async () => {
          try {
            await parkingService.assignParking("jippy");
          } catch (error) {
              expect(error).toBeDefined();
              expect(error.message).toEqual(`Invite not found with id`)
          }
      });

  });

  describe("unreserveParking", () => {
    it("should not throw an error if valid invitation ID given", async () => {
        try{
            await parkingService.unreserveParking("f11ae766-ce23-4f27-b428-83cff1afbf04");  
            expect("").toEqual("");
        }
        catch(error){
            expect("").toEqual(0);
        } 

    });
    
    it("should throw an exception if an invalid invitation ID is given", async () => {
        try {
          await parkingService.unreserveParking("jippy");
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual(`Invite not found with id`)
        }
    });
});

  describe("reserveParking", () => {
      it("should return the parking reservation made if valid invitation ID is given", async () => {
          const makeRes = await parkingService.reserveParking("cb7c7938-1c41-427d-833e-2c6b77e0e26b");
          expect(makeRes.invitationID).toEqual("cb7c7938-1c41-427d-833e-2c6b77e0e26b");
      });

      it("should throw an exception if an invalid invitation ID is given", async () => {
          try {
              await parkingService.reserveParking("jippy");
          } catch (error) {
              expect(error).toBeDefined();
              expect(error.message).toEqual("Invite not found with id")
          }
      });

      it("should throw an exception if an invite already has a reservation", async () => {
        try {
            await parkingService.reserveParking("f11ae766-ce23-4f27-b428-83cff1afbf04");
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual("Invitation with ID f11ae766-ce23-4f27-b428-83cff1afbf04 already have reserved parking.")
        }
      });

      it("should throw an exception if no free parking available", async () => {
        //TODO (Larisa) but not sure how
      });

  });

  describe("reserveParkingSpace", () => {
    it("should return the parking reservation made if valid invitation ID and parking number is given", async () => {
        const makeRes = await parkingService.reserveParkingSpace(0,"cb7c7938-1c41-427d-833e-2c6b77e0e26b");
        expect(makeRes.parkingNumber).toEqual(0);
    });

    it("should throw an exception if an invalid invitation ID is given", async () => {
        try {
            await parkingService.reserveParkingSpace(0,"jippy");
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual("Invite not found with id")
        }
    });

    it("should throw an exception if parking space is disabled", async () => {
        try {
            await parkingService.reserveParkingSpace(2,"cb7c7938-1c41-427d-833e-2c6b77e0e26b");
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual("Parking number 2 is temporarily disabled.")
        }
      });

    it("should throw an exception if an invalid parking number is given", async () => {
        try {
            await parkingService.reserveParkingSpace(999,"cb7c7938-1c41-427d-833e-2c6b77e0e26b");
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual("Parking number 999 is out of parking range. Parking range from 0 to 8")
        }
    });

    it("should throw an exception if an invite already has a reservation", async () => {
        try {
            await parkingService.reserveParkingSpace(0,"f11ae766-ce23-4f27-b428-83cff1afbf04");
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual("Invitation with ID f11ae766-ce23-4f27-b428-83cff1afbf04 already have reserved parking.")
        }
    });

    it("should throw an exception if the parking spot is not available", async () => {
        try {
            await parkingService.reserveParkingSpace(1,"cb7c7938-1c41-427d-833e-2c6b77e0e26b");
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual("Parking number 1 is not available.")
        }
    });

    });

    describe("enableParkingSpace", () => {
        it("should return the enabled parking if a valid parking number is given", async () => {
            const parking = await parkingService.enableParkingSpace(0);
            expect(parking.enabled).toEqual(true);
        });
    
        it("should throw an exception if an invalid parking number is given", async () => {
            try {
                await parkingService.enableParkingSpace(999);
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("Parking number 999 is out of parking range. Parking range from 0 to 8")
            }
        });
    });

    describe("disableParkingSpace", () => {
        it("should return the disabled parking if a valid parking number is given", async () => {
            const parking = await parkingService.disableParkingSpace(0);
            expect(parking.enabled).toEqual(false);
        });
    
        it("should throw an exception if an invalid parking number is given", async () => {
            try {
                await parkingService.disableParkingSpace(999);
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("Parking number 999 is out of parking range. Parking range from 0 to 8")
            }
        });
    });


    describe("getParkingReservations", () => {
        it("should return the parking reservation made if a valid parking number is given", async () => {
            const reservations = await parkingService.getParkingReservations(0);
            expect(reservations.length).toEqual(1);
        });
    
        it("should throw an exception if an invalid parking number is given", async () => {
            try {
                await parkingService.getParkingReservations(999);
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("Parking number 999 is out of parking range. Parking range from 0 to 8")
            }
        });

        it("should throw an exception if the parking has no reservations", async () => {
            try {
                await parkingService.getParkingReservations(3);
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("No reservations for parking number 3")
            }
        });
    });

    describe("getParkingReservationsInRange", () => {

        it("should return array of reservations if valid dates given", async () => {
            const array = await parkingService.getParkingReservationInRange("2022-03-01","2022-04-05");
            expect(array.length).toEqual(2);
        });

        it("should throw an exception if a date is of the wrong format", async () => {
            try {
                await parkingService.getParkingReservationInRange("01-03-2022","2022-04-05");
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("Given dates must be of the form yyyy-mm-dd")
            }
        });

        it("should throw an exception if the start date is greater than the end date", async () => {
            try {
                await parkingService.getParkingReservationInRange("2022-04-06","2022-04-05");
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("Start date can not be later than the end date")
            }
        });
    
    });

    describe("getTotalUsedParkingInRange", () => {
        it("should return array of length equal to the date range if valid dates given", async () => {
            const array = await parkingService.getUsedParkingInRangeByDate("2022-03-01","2022-04-05");
            expect(array.length).toEqual(36);
        });

        it("should return array of length 1 if equal dates is given", async () => {
            const array = await parkingService.getUsedParkingInRangeByDate("2022-03-01","2022-03-01");
            expect(array.length).toEqual(1);
        });

        it("should throw an exception if a date is of the wrong format", async () => {
            try {
                await parkingService.getUsedParkingInRangeByDate("01-03-2022","2022-04-05");
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("Given dates must be of the form yyyy-mm-dd")
            }
        });

        it("should throw an exception if the start date is greater than the end date", async () => {
            try {
                await parkingService.getUsedParkingInRangeByDate("2022-04-06","2022-04-05");
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("Start date can not be later than the end date")
            }
        });
    
    });


        describe("getParkingReservations", () => {
        it("should return the parking reservation made if a valid parking number is given", async () => {
            const reservations = await parkingService.getParkingReservations(0);
            expect(reservations.length).toEqual(1);
        });
    
        it("should throw an exception if an invalid parking number is given", async () => {
            try {
                await parkingService.getParkingReservations(999);
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toEqual("Parking number 999 is out of parking range. Parking range from 0 to 8")
            }
        });
        });

        describe("getInviteReservation", () => {
            it("should return the parking reservation made if a valid invitation ID is given", async () => {
                const reservations = await parkingService.getInviteReservation("f11ae766-ce23-4f27-b428-83cff1afbf04");
                expect(reservations.parkingNumber).toEqual(0);
            });
        
            it("should throw an exception if an invalid invitation ID is given", async () => {
                try {
                    await parkingService.getInviteReservation("jippy");
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(`Invite not found with id`)
                }
            });

            it("should throw an exception if an invitation ID have no reservations", async () => {
                try {
                    await parkingService.getInviteReservation("cb7c7938-1c41-427d-833e-2c6b77e0e26b");
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(`No reservations for invitation with ID cb7c7938-1c41-427d-833e-2c6b77e0e26b`)
                }
            });
        });

        describe("getReservations", () => {
        
            it("should throw an exception there is no reservations", async () => {
                try {
                    await parkingService.getReservations();
                } catch (error) {
                    expect(error).toBeDefined();
                    expect(error.message).toEqual(`No Reserved parkings`)
                }
            });
        });

        

});
