import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, IQuery, QueryBus } from "@nestjs/cqrs";
import { ParkingService } from './parking.service';
import { GetAvailableParkingQuery } from './queries/impl/getAvailableParking.query';
import {FreeParkingCommand} from './commands/impl/freeParking.command';
import {AssignParkingCommand} from './commands/impl/assignParking.command';
import {ReserveParkingCommand} from './commands/impl/reserveParking.command';

import { ParkingNotFound } from './errors/parkingNotFound.error';
import { VisitorInviteService } from '@vms/visitor-invite';
import { MailService } from '@vms/mail/mail.service';

describe('ParkingService', () => {
  let parkingService: ParkingService;
  let inviteService: VisitorInviteService;

  const queryBusMock = {
      execute: jest.fn((query: IQuery) => {
            if(query instanceof GetAvailableParkingQuery) {
                return 8;
            } 
      }), 
  };

  const commandBusMock = {
      execute: jest.fn((command) => {
          if(command instanceof FreeParkingCommand) {
             if(command.parkingNumber === 1) {
                 return true;
             } else {
                 return undefined;
             }
          } else if(command instanceof AssignParkingCommand) {
              if(command.parkingNumber === 1) {
                  return true;
              } else {
                  return undefined;
              }
          } else if(command instanceof ReserveParkingCommand) {
              if(command.parkingNumber === 1) {
                  return {
                      reservationInviteID: "2133-4fek-12mce-fee1"
                  };
              } else {
                  return undefined;
              }
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
          const parking = await parkingService.freeParking(0);
          expect(parking).toEqual(true);
      });

      it("should return undefined when invalid parking number is given", async () => {
              const parking = await parkingService.freeParking(999);
              expect(parking).toBeUndefined();
      });
  });

  describe("assignParking", () => {
      it("should return valid parking if invitation ID is valid and reservation is made", async () => {
          const parking = await parkingService.assignParking("f11ae766-ce23-4f27-b428-83cff1afbf04");
          const invite = await inviteService.getInvite("f11ae766-ce23-4f27-b428-83cff1afbf04");
          expect(parking.visitorEmail).toEqual(invite.email);
      });

      it("should throw an expception if invitation ID is valid and no reservation is made", async () => {
        try{
            await parkingService.assignParking("cb7c7938-1c41-427d-833e-2c6b77e0e26b");
        }catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toEqual("Reservation cb7c7938-1c41-427d-833e-2c6b77e0e26b not found");
        }
    });

      it("should throw an expception if an invalid invitation is given", async () => {
          try {
            await parkingService.assignParking("f11ae766-ce23-4f27-b428-83cff1afbf04");
          } catch (error) {
              expect(error).toBeDefined();
              expect(error.message).toEqual(`Invitation with ID f11ae766-ce23-4f27-b428-83cff1afbf04 not found`)
          }
      });

  });

  describe("reserveParking", () => {
      it("should return the parking reservation made if valid invitation ID is given", async () => {
          const makeRes = await parkingService.reserveParking("f11ae766-ce23-4f27-b428-83cff1afbf04");
          const getRes = await parkingService.getInviteReservations("f11ae766-ce23-4f27-b428-83cff1afbf04");
          expect(makeRes).toEqual(getRes);
      });

      it("should throw an expception if an invalid invitation ID is given", async () => {
          try {
              await parkingService.reserveParking("jippy");
          } catch (error) {
              expect(error).toBeDefined();
              expect(error.message).toEqual("Invitation with ID jippy not found")
          }
      });
  });

  //TODO (Larisa) test the rest of the functions
});

