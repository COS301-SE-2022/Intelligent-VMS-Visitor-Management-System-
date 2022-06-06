import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { RestrictionsService } from './restrictions.service';

describe('RestrictionsService', () => {
  let service: RestrictionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
            RestrictionsService,
            QueryBus,
            CommandBus
        ],
    }).compile();

    service = module.get<RestrictionsService>(RestrictionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
