import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { SetCurfewTimeCommand } from './commands/impl/setCurfewTime.command';
import { SetNumInvitesCommand } from './commands/impl/setNumInvites.command';
import { GetCurfewTimeQuery } from './queries/impl/getCurfewTime.query';
import { GetNumInvitesQuery } from './queries/impl/getNumInvites.query';
import { RestrictionsService } from './restrictions.service';

describe('RestrictionsService', () => {
  let service: RestrictionsService;
  let queryBus: QueryBus;
  let commandBus: CommandBus;

  const queryBusMock = {
      execute: jest.fn((query) => {
        if(query instanceof GetNumInvitesQuery) {
            return {
                numInvites: 1
            }
        } else if(query instanceof GetCurfewTimeQuery) {
            return {
                curfewTime: 2300
            }
        }
      })
  };

  const commandBusMock = {
      execute: jest.fn((command) => {
        if(command instanceof SetNumInvitesCommand) {
            return true;
        } else if(command instanceof SetCurfewTimeCommand) {
            return true;
        }
      })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
            RestrictionsService,
            QueryBus,
            CommandBus,
            {
                provide: QueryBus, useValue: queryBusMock
            },
            {
                provide: CommandBus, useValue: commandBusMock
            }
        ],
    }).compile();

    service = module.get<RestrictionsService>(RestrictionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should return a valid number of invites", async () => {
        const res = await service.getNumInvitesPerResident();
        expect(res.numInvites).toBeDefined();
  });

  it("should return a valid number for curfew time", async () => {
        const res = await service.getCurfewTime();
        expect(res.curfewTime).toBeDefined();
  });

  it("should return a boolean indicating that the num invites restriction has changed", async () => {
      const res = await service.setNumInvitesPerResident(3);
      expect(res).toEqual(true);
  });

  it("should return a boolean indicating that the curfew time has changed", async () => {
      const res = await service.setNumInvitesPerResident(1200);
      expect(res).toEqual(true);
  });

  it("should return the new value after updating num invites", async () => {
      const res = await service.setNumInvitesPerResident(1);
      expect(res).toEqual(true);

      const val = await service.getNumInvitesPerResident();
      expect(val.numInvites).toEqual(1);
  });

  it("should return a boolean indicating that the num invites restriction has changed", async () => {
      const res = await service.setNumInvitesPerResident(2300);
      expect(res).toEqual(true);

      const val = await service.getCurfewTime();
      expect(val.curfewTime).toEqual(2300);
  });
  

});
