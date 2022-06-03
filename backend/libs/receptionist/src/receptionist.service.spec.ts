import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '@vms/mail';
import { ParkingService } from '@vms/parking';
import { VisitorInviteService } from '@vms/visitor-invite';
import { ReceptionistService } from './receptionist.service';

describe('ReceptionistService', () => {
  let service: ReceptionistService;
  let inviteService: VisitorInviteService;
 /*eslint-disable*/
  const commandBusMock = {
    execute: jest.fn((command) => {
        
    }),
  };

  const queryBusMock = {
    execute: jest.fn((command) => {
        
    }),
  };
  /*eslint-enable*/

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceptionistService,
        VisitorInviteService,
        ParkingService,
        MailService,
        {
          provide: QueryBus, useValue: queryBusMock
        },
        {
          provide: CommandBus, useValue: commandBusMock
        }],
    }).compile();

    service = module.get<ReceptionistService>(ReceptionistService);
    inviteService = module.get<VisitorInviteService>(VisitorInviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(inviteService).toBeDefined();
  });
});
