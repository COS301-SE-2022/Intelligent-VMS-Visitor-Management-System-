import { Test, TestingModule } from '@nestjs/testing';
import { SignOutService } from './sign-out.service';

describe('SignOutService', () => {
  let service: SignOutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignOutService],
    }).compile();

    service = module.get<SignOutService>(SignOutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
