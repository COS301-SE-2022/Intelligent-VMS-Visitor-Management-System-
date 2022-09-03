import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerService } from './throttler.service';

describe('ThrottlerService', () => {
  let service: ThrottlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThrottlerService],
    }).compile();

    service = module.get<ThrottlerService>(ThrottlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
