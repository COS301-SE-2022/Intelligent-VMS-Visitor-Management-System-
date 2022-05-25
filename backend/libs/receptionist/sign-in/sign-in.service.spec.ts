import { Test, TestingModule } from '@nestjs/testing';
import { SignInService } from './sign-in.service';

describe('SignInService', () => {
  let service: SignInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignInService],
    }).compile();

    service = module.get<SignInService>(SignInService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
