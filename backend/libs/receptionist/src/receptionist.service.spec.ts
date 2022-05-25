import { Test, TestingModule } from '@nestjs/testing';
import { ReceptionistService } from './receptionist.service';

describe('ReceptionistService', () => {
  let service: ReceptionistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceptionistService],
    }).compile();

    service = module.get<ReceptionistService>(ReceptionistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
