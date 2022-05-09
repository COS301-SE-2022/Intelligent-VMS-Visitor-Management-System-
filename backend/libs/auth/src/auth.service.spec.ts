import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UserService } from "@vms/user";
import { QueryBus } from "@nestjs/cqrs";
import { LoginFailed } from "./errors/loginFailed.error";

describe("AuthService", () => {
    let service: AuthService;
    let jwtService: JwtService;

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
        jwtService = module.get<JwtService>(JwtService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("Login", () => {
        it("should return an access token on valid user data", async () => {
            jest.spyOn(service, "login").mockImplementation(
                async (user: any) => {
                    if (
                        user.email === "admin@mail.com" &&
                        user.password === "password"
                    ) {
                        const payload = {
                            email: user.email,
                            permission: 0,
                        };

                        return {
                            access_token: jwtService.sign(payload),
                        };
                    }
                },
            );

            const payload = await service.login({
                email: "admin@mail.com",
                password: "password",
            });

            expect(payload).toHaveProperty("access_token");
        });
    });

    describe("validateUser", () => {
        it("should return a user object on valid user data", async () => {
            jest.spyOn(service, "validateUser").mockImplementation(
                async (email: string, password: string) => {
                    let user = undefined;

                    if (email === "admin@mail.com") {
                        user = {
                            email: "admin@mail.com",
                            password: "password",
                        };
                    }

                    if (user) {
                        const samePassword = password === "password";

                        if (samePassword) {
                            return user;
                        }

                        throw new LoginFailed("Incorrect Password");
                    }

                    throw new LoginFailed("User not found");
                },
            );

            const user = await service.validateUser(
                "admin@mail.com",
                "password",
            );

            expect(user).toBeDefined();
            expect(user).toHaveProperty("email");
            expect(user).toHaveProperty("password");
            expect(user.email).toEqual("admin@mail.com");
        });

        it("should throw an exception on invalid user email", async () => {
            jest.spyOn(service, "validateUser").mockImplementation(
                async (email: string, password: string) => {
                    let user = undefined;

                    if (email === "admin@mail.com") {
                        user = {
                            email: "admin@mail.com",
                            password: "password",
                        };
                    }

                    if (user) {
                        const samePassword = password === "password";

                        if (samePassword) {
                            return user;
                        }

                        throw new LoginFailed("Incorrect Password");
                    }

                    throw new LoginFailed("User not found");
                },
            );
            expect(
                service.validateUser("error@mail.com", "password"),
            ).rejects.toThrow(LoginFailed);
        });

        it("should throw an exception on invalid user password", async () => {
            jest.spyOn(service, "validateUser").mockImplementation(
                async (email: string, password: string) => {
                    let user = undefined;

                    if (email === "admin@mail.com") {
                        user = {
                            email: "admin@mail.com",
                            password: "password",
                        };
                    }

                    if (user) {
                        const samePassword = password === "password";

                        if (samePassword) {
                            return user;
                        }

                        throw new LoginFailed("Incorrect Password");
                    }

                    throw new LoginFailed("User not found");
                },
            );
            expect(
                service.validateUser("error@mail.com", "password"),
            ).rejects.toThrow(LoginFailed);
        });
    });
});
