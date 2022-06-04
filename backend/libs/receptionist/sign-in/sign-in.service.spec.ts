import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '@vms/mail';
import { ParkingService } from '@vms/parking';
import { VisitorInviteService } from '@vms/visitor-invite';
import { SignInService } from './sign-in.service';

describe('SignInService', () => {
  let service: SignInService;
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
      providers: [SignInService,
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

    service = module.get<SignInService>(SignInService);
    inviteService = module.get<VisitorInviteService>(VisitorInviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
