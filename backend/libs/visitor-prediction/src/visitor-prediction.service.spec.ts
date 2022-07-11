import { Test, TestingModule } from '@nestjs/testing';
import { VisitorPredictionService } from './visitor-prediction.service';

describe('VisitorPredictionService', () => {
  let service: VisitorPredictionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitorPredictionService],
    }).compile();

    service = module.get<VisitorPredictionService>(VisitorPredictionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
