import { Test, TestingModule } from "@nestjs/testing";
import { ParkingService } from "./parking.service";

describe('ParkingService Int', () => {
    let service: ParkingService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ParkingService  
            ],
        }).compile();

        await module.init()

        service = module.get<ParkingService>(ParkingService);
    });

    /*describe("getAvailableParking", () => {
        it("should return the number of unused parking spots", async () => {
            let amount = 0;
            try{
                amount = await service.getAvailableParking();
            } catch (error) {
            }
            expect(amount).toEqual(8);
        });    
  });*/
})