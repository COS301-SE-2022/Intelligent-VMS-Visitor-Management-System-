import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { RestrictionsService } from '@vms/restrictions';
import { UserService } from '@vms/user';
import { VisitorInviteService } from '@vms/visitor-invite';
import { RewardsService } from './rewards.service';

describe('RewardsService', () => {
  let service: RewardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RewardsService,
                  QueryBus,
                  CommandBus,
                  UserService,
                  VisitorInviteService,
                  RestrictionsService],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
