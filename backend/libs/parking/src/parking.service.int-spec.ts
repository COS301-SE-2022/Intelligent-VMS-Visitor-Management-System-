import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { VisitorInviteService } from "@vms/visitor-invite";
import { ParkingModule } from "./parking.module";
import { ParkingService } from "./parking.service";

describe('ParkingService Int', () => {
    let service: ParkingService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ParkingModule,
                MongooseModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: async (configService: ConfigService) => ({
                        uri: configService.get<string>("MONGO_TEST_DB_CONNECTION_STRING"),
                    }),
                    inject: [ConfigService],
                }),
            ],
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