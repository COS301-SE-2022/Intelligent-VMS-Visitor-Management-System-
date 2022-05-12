import { Test, TestingModule } from "@nestjs/testing";
import { QueryBus } from "@nestjs/cqrs";
import { ResidentResolver } from "./resident.resolver";
import { AuthService } from "../../auth/src/auth.service";
import { UserService } from "@vms/user";
import { JwtService } from "@nestjs/jwt";
import {ResidentService} from "./resident.service";
describe("ResidentResolver", () => {
    let resolver: ResidentResolver;
    //let service:AuthService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ResidentResolver,AuthService,ResidentService,JwtService,UserService, QueryBus],
        }).useMocker((token) => {
            if (token.toString() === "JWT_MODULE_OPTIONS") {
                return {
                    secret: "test",
                    signOptions: { expiresIn: "60s" },
                };
            }
            return null;
        })
        .compile();

        resolver = module.get<ResidentResolver>(ResidentResolver);
        //service = module.get<AuthService>(AuthService);
    });

   

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});