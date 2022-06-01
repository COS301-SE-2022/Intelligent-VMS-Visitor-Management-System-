import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '@vms/mail';
import { ParkingService } from '@vms/parking';
import { VisitorInviteService } from '@vms/visitor-invite';
import { SignOutService } from './sign-out.service';

describe('SignOutService', () => {
  let service: SignOutService;
  let inviteService: VisitorInviteService;

  const commandBusMock = {
    execute: jest.fn((command) => {
        
    }),
  };

  const queryBusMock = {
    execute: jest.fn((command) => {
        
    }),
  };

  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignOutService,
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

    service = module.get<SignOutService>(SignOutService);
    inviteService = module.get<VisitorInviteService>(VisitorInviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
