import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, IQuery, QueryBus } from "@nestjs/cqrs";
import { ParkingService } from './parking.service';
import { GetAvailableParkingQuery } from './queries/impl/getAvailableParking.query';
import {FreeParkingCommand} from './commands/impl/freeParking.command';
import {AssignParkingCommand} from './commands/impl/assignParking.command';
import {ReserveParkingCommand} from './commands/impl/reserveParking.command';
import { VisitorInviteService } from '@vms/visitor-invite';
import { MailService } from '@vms/mail/mail.service';
import { Parking } from './models/parking.model';
import { GetInviteQuery } from '@vms/visitor-invite/queries/impl/getInvite.query';
import { Invite } from '@vms/visitor-invite/schema/invite.schema';
import { GetInviteReservationQuery } from './queries/impl/getInviteReservation.query';
import { ParkingReservation } from './models/reservation.model';
import { GetParkingReservationsQuery } from './queries/impl/getParkingReservations.query';
import { AddParkingCommand } from './commands/impl/addParking.command';
import { CreateNParkingSpotsCommand } from './commands/impl/createNParkingSpots.command';
import { GetReservationsQuery } from './queries/impl/getReservations.query';

describe('ParkingService', () => {
  let parkingService: ParkingService;
  let inviteService: VisitorInviteService;

  const queryBusMock = {
      execute: jest.fn((query: IQuery) => {
            if(query instanceof GetAvailableParkingQuery) {
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
                    reservation.invitationID= "f11ae766-ce23-4f27-b428-83cff1afbf04"
                    return reservation;
                } else
                return undefined;
                
            } else if(query instanceof GetParkingReservationsQuery){
                if(query.parkingNumber === 0 )
                {
                    const reservations = [];
                    const reservation = new ParkingReservation();
                    reservation.parkingNumber= 0;
                    reservation.invitationID= "f11ae766-ce23-4f27-b428-83cff1afbf04"
                    reservations[0]=reservation;
                    return reservations;
                } else
                return [];
                                
            } else if(query instanceof GetReservationsQuery){
                return [];
                
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
              if(command.parkingNumber === 0 && command.invitationID === "cb7c7938-1c41-427d-833e-2c6b77e0e26b") {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
            ParkingService, 
            VisitorInviteService,
            MailService,
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

  describe("getAvailableParking", () => {
        it("should return the number of unused parking spots", async () => {
            let amount = 0;
            try{
                amount = await parkingService.getAvailableParking();
            } catch (error) {
            }
            expect(amount).toEqual(8);
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
          const spaces = await parkingService.getAvailableParking();
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
  
  describe("createNParking", () => {
    it("should return array of the same length as input", async () => {
        let len;
        try{
        const parking = await parkingService.createNParkingSpots(3);
        len = parking.length;
        } catch(error){}
        expect(len).toEqual(3);
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

      it("should throw an exception if invitation ID is valid and no reservation is made", async () => {
        try{
            await parkingService.assignParking("cb7c7938-1c41-427d-833e-2c6b77e0e26b");
        }catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual("Reservation for cb7c7938-1c41-427d-833e-2c6b77e0e26b not found");
        }
    });

      it("should throw an exception if an invalid invitation is given", async () => {
          try {
            await parkingService.assignParking("jippy");
          } catch (error) {
              expect(error).toBeDefined();
              expect(error.message).toEqual(`Invitation with ID jippy not found`)
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
              expect(error.message).toEqual("Invitation with ID jippy not found")
          }
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
            expect(error.message).toEqual("Invitation with ID jippy not found")
        }
    });

    it("should throw an exception if an invalid parking number is given", async () => {
        try {
            await parkingService.reserveParkingSpace(999,"f11ae766-ce23-4f27-b428-83cff1afbf04");
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
                    expect(error.message).toEqual(`Invitation with ID jippy not found.`)
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

  //TODO (Larisa) test the rest of the functions
});