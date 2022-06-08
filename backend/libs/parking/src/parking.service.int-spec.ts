import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { VisitorInviteService } from "@vms/visitor-invite";
import { Test, TestingModule } from "@nestjs/testing";
import { ParkingService } from "./parking.service";
import { forwardRef } from "@nestjs/common";

describe('ParkingService Int', () => {
    let service: ParkingService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
           /* imports: [
                MongooseModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: async (configService: ConfigService) => ({
                        uri: configService.get<string>("MONGO_TEST_DB_CONNECTION_STRING"),
                    }),
                    inject: [ConfigService],
                }),
            ],*/
            providers: [
                ParkingService, 
                VisitorInviteService
            ],
        }).compile();

        await module.init()

        service = module.get(ParkingService);
    });

    describe("addParking", () => {
        it("should return a new parking space", async () => {
            let parking;         
            parking = await service.addParking();
            expect(parking).toBeDefined();
          });
      });
})