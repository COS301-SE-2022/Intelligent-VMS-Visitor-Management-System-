import { HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus, IQuery, QueryBus } from '@nestjs/cqrs';
import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '@vms/mail';
import { ParkingService } from '@vms/parking';
import { RestrictionsService } from '@vms/restrictions';
import { UserService } from '@vms/user';
import { GetUserQuery } from '@vms/user/queries/impl/getUser.query';
import { User, UserDocument } from '@vms/user/schema/user.schema';
import { VisitorInviteService } from '@vms/visitor-invite';
import { Model } from 'mongoose';
import { GetAllBadgesQuery } from './queries/impl/getAllBadges.query';
import { GetAllRewardsQuery } from './queries/impl/getAllRewards.query';
import { GetMaxRequirementQuery } from './queries/impl/getMaxRequirement.query';
import { RewardsService } from './rewards.service';

describe('RewardsService', () => {
  let service: RewardsService;
  let mockUserModel: Model<UserDocument>;

  const queryBusMock = {
    execute: jest.fn((query: IQuery) => {
          if(query instanceof GetAllRewardsQuery) {
            return []
          }else if(query instanceof GetAllBadgesQuery){
            return []
          }else if(query instanceof GetMaxRequirementQuery){
            return 100
          }
    })
  }

  const scheduleMock = {
    addCronJob: jest.fn(()=>{return {}}),
    deleteCronJob: jest.fn(()=>{return {}}),
  };

  const userMock = {
    getUserByEmail: jest.fn((emailIn)=>{return {xp:20,email:emailIn,badges:"1000000"}}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [RewardsService,
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
                  {
                    provide: QueryBus, useValue: queryBusMock
                  },
                  CommandBus,
                  {
                    provide: UserService, useValue: userMock
                  },
                ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get all badges', async () => {
    let badges = await service.getAllBadges()
    expect(badges).toEqual([]);
  });

  it('get all rewards', async () => {
    let rewards = await service.getAllRewards();
    expect(rewards).toEqual([]);
  });

  it('get max requirement', async() => {
    let req = await service.getMaxRequirement();
    expect(req).toEqual(100);
  });

  it('get profile info', async () => {
    let pi = await service.getProfileInfo("larisabotha@gmail.com");
    expect(pi).toEqual({
      badges: "1000000",
      xp: 20,
      progress: 20,
      allBadges: [],
      allRewards: []
    });
  });
});
