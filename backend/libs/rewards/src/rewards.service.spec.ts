import { HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '@vms/mail';
import { ParkingService } from '@vms/parking';
import { RestrictionsService } from '@vms/restrictions';
import { UserService } from '@vms/user';
import { User, UserDocument } from '@vms/user/schema/user.schema';
import { VisitorInviteService } from '@vms/visitor-invite';
import { Model } from 'mongoose';
import { RewardsService } from './rewards.service';

describe('RewardsService', () => {
  let service: RewardsService;
  let mockUserModel: Model<UserDocument>;

  const scheduleMock = {
    addCronJob: jest.fn(()=>({})),
    deleteCronJob: jest.fn(()=>({})),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [RewardsService,
                  QueryBus,
                  CommandBus,
                  VisitorInviteService,
                  RestrictionsService,
                  ConfigService,
                  MailService,
                  ParkingService,
                  { provide: SchedulerRegistry, useValue: scheduleMock},
                  {
                    provide: getModelToken(User.name),
                    useValue: Model,
                  },
                  {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: () => {return 'any value'},
                        set: () => {return jest.fn()},
                    },
                },
                  UserService,
                ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
