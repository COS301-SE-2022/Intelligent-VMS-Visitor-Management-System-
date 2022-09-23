import { Test, TestingModule } from '@nestjs/testing';
import { RateLimitStorageService } from './throttler.service';

describe('ThrottlerService', () => {
  let service: RateLimitStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateLimitStorageService],
    }).compile();

    service = module.get<RateLimitStorageService>(RateLimitStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRecord', () => {
    it('should get record', async () => {
      const storage = service.storage;

      const response = await service.getRecord('a');

      expect(response).toEqual([]);
    })
  })

  describe('addRecord', () => {
    it('should add record', async () => {
      const response = await service.addRecord('a', 5);

      expect(response).toBeUndefined();
    })
  })

});
