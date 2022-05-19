import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, IQuery, QueryBus } from "@nestjs/cqrs";
import { ParkingService } from './parking.service';
import { GetAvailableParkingQuery } from './queries/impl/getAvailableParking.query';
import {FreeParkingCommand} from './commands/impl/freeParking.command';
import {AssignParkingCommand} from './commands/impl/assignParking.command';
import {ReserveParkingCommand} from './commands/impl/reserveParking.command';

import { ParkingNotFound } from './errors/parkingNotFound.error';

describe('ParkingService', () => {
  let service: ParkingService;

  const queryBusMock = {
      execute: jest.fn((query: IQuery) => {
            if(query instanceof GetAvailableParkingQuery) {
                return 999;
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
            {
                    provide: QueryBus, useValue: queryBusMock
            },
            {
                provide: CommandBus, useValue: commandBusMock
            }
        ],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getAvailableParking", () => {
        it("should return the number of unused parking spots", async () => {
            expect(await service.getAvailableParking()).toEqual(999);
        });    
  });

  describe("freeParking", () => {
      it("should return true if parking number valid", async () => {
          expect(await service.freeParking(1)).toEqual(true);
      });

      it("should throw an expception if an invalid parking number is given", async () => {
          try {
              await service.freeParking(999);
          } catch (error) {
              expect(error).toBeDefined();
              expect(error.message).toEqual("Parking with Number: 999 not found")
          }
      });
  });

  describe("assignParking", () => {
      /*it("should return true if parking number is valid", async () => {
          expect(await service.assignParking("admin@mail.com",1)).toEqual(true);
      });

      it("should throw an expception if an invalid parking number is given", async () => {
          try {
              await service.assignParking("", 999);
          } catch (error) {
              expect(error).toBeDefined();
              expect(error.message).toEqual("Parking with Number: 999 not found")
          }
      });*/
      //These tests are obsolute
      //TODO (Larisa) update tests
  });

  describe("reserveParking", () => {
      it("should return true if parking number is valid", async () => {
          expect(await service.reserveParkingSpace(1, "dwdwf-233-1-2fe-2")).toEqual("2133-4fek-12mce-fee1");
      });

      it("should throw an expception if an invalid parking number is given", async () => {
          try {
              await service.reserveParkingSpace(999, "");
          } catch (error) {
              expect(error).toBeDefined();
              expect(error.message).toEqual("Parking with Number: 999 not found")
          }
      });
  });

});

