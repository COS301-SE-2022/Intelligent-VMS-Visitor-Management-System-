import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtService, JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UserService } from "@vms/user";
import { QueryBus } from "@nestjs/cqrs";

describe("AuthService", () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, JwtService, UserService, QueryBus],
        })
            .useMocker((token) => {
                if (token.toString() === "JWT_MODULE_OPTIONS") {
                    return {
                        secret: "test",
                        signOptions: { expiresIn: "60s" },
                    };
                }
                return null;
            })
            .compile();

        service = module.get<AuthService>(AuthService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
