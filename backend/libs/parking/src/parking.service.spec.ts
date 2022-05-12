import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ParkingService } from './parking.service';

describe('ParkingService', () => {
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingService, CommandBus, QueryBus],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('valid information should reserve parking', async () => {
   const s = service.reserveParking(0, "dec9bc69-b98a-4053-b4e7-e62bc33089bd");
   //s must be parking type
   expect((await s)).toBe("pass");
});
});

