import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { UserService } from "@vms/user";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import * as FormData from "form-data";

import { LoginFailed } from "./errors/loginFailed.error";
import { SignUpFailed } from "./errors/signupFailed.error";
import { MailService } from "@vms/mail";
import { VerificationFailed } from "./errors/verificationFailed.error";

@Injectable()
export class AuthService {
    FACE_REC_CONNECTION: string;
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private mailService: MailService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
        this.FACE_REC_CONNECTION = this.configService.get<string>(
            "http://127.0.0.1:3003", // FACE_REC_API_CONNECTION
        );
    }

    async validateUser(email: string, pass: string) {
        const user = await this.userService.findOne(email);

        if (user) {
            const samePassword = await bcrypt.compare(pass, user.password);
            if (samePassword) {
                return user;
            }

            throw new LoginFailed("Incorrect Password");
        }

        throw new LoginFailed("User not found");
    }

    async login(user: any) {
        const validUser = await this.validateUser(user.email, user.password);

        if (validUser !== null) {
            this.userService.calculateBadges(user.email);
            const payload = {
                email: user.email,
                permission: validUser.permission,
                name: validUser.name,
            };
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
    }

    async signup(user: any) {
        console.log(user);
        const emailUser = await this.userService.findOne(user.email);
        console.log("Email User:", emailUser);

        if (emailUser === null) {
            if ((await this.cacheManager.get(user.email)) === undefined) {
                console.log("Original Password:", user.password);

                const hashPass = await bcrypt.hash(user.password, 3);

                console.log("Hashed Password:", hashPass);

                let permission = 0;

                if (user.type === "resident") {
                    permission = -2;
                } else if (user.type === "receptionist") {
                    permission = -1;
                } else if (user.type === "admin") {
                    permission = -3;
                } else {
                    console.log("Invalid User Type Provided:", user.type);
                    return {
                        error: "Invalid User Type Provided",
                    };
                }
                console.log("User Type:", user.type);

                const formData = new FormData();
                /*
                const requiredProperties = [
                    "file",
                    "file.buffer",
                    "file.originalname",
                ];
                const missingProperties = [];

                for (const property of requiredProperties) {
                    if (!getProperty(user, property)) {
                        missingProperties.push(property);
                    }
                }

                if (missingProperties.length === 0) {
                    formData.append("file", user.file.buffer, {
                        filename: user.file.originalname,
                    });
                } else {
                    console.error(
                        `Missing properties in user object: ${missingProperties.join(
                            ", ",
                        )}`,
                    );
                    // Handle the error or return an appropriate response
                }

                // Helper function to safely get nested properties
                function getProperty(obj: any, path: string): any {
                    return path
                        .split(".")
                        .reduce(
                            (o, key) =>
                                o && o[key] !== "undefined"
                                    ? o[key]
                                    : undefined,
                            obj,
                        );
                }
                */

                formData.append("file", user.file.buffer, {
                    filename: user.file.originalname,
                });
                console.log("FormData:", formData);
                console.log("COde breaks here!");

                /*
                const response = await firstValueFrom(
                    this.httpService.post(
                        `${this.FACE_REC_CONNECTION}/getNumFaces`,
                        formData,
                        { headers: formData.getHeaders() },
                    ),
                );
                console.log("Face Recognition Response:", response.data.result);

                console.log(response.data.result);
                if (response.data.result === 0) {
                    console.log("No faces detected in uploaded file");
                    return {
                        error: "No faces detected in uploaded file",
                    };
                }
                */

                const verifyID = randomUUID();

                await this.cacheManager.set(
                    user.email,
                    {
                        email: user.email,
                        password: hashPass,
                        confirmationPin: user.confirmationPin,
                        permission: permission,
                        idNumber: user.idNumber,
                        name: user.name,
                        file: user.file,
                        idDocType: user.idDocType,
                        verifyID: verifyID,
                    },
                    { ttl: 1000 },
                );

                console.log("Verification ID:", verifyID);

                await this.mailService.sendVerify(user.email, verifyID);

                return {
                    result: true,
                };
            }
            console.log("User is already signed up");
            return {
                error: "User is already signed up",
            };
        }
        console.log("User already exists");
        return {
            error: "User already exists",
        };
    }

    async verifyNewAccount(verifyID: string, email: string) {
        if (
            /[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/.test(
                verifyID,
            )
        ) {
            const user: any = await this.cacheManager.get(email);
            if (user !== undefined) {
                if (user.verifyID === verifyID) {
                    await this.cacheManager.del(email);
                    let encodedData = await user.file.buffer.toString("base64");

                    if (
                        user.file.originalname.indexOf("jpeg") ||
                        user.file.originalname.indexOf("jpg")
                    ) {
                        encodedData = "data:image/jpeg;base64," + encodedData;
                    } else {
                        encodedData = "data:image/png;base64," + encodedData;
                    }

                    await this.userService.createUser(
                        user.email,
                        user.password,
                        user.permission,
                        user.idNumber,
                        user.idDocType,
                        user.name,
                        user.confirmationPin ? user.confirmationPin : "",
                        encodedData,
                    );
                    return true;
                }
                throw new VerificationFailed("Invalid Verification ID given");
            }

            throw new VerificationFailed(
                "Email Not Found, please signup again",
            );
        }
        throw new VerificationFailed("Invalid verification ID");
    }

    async resendVerifyEmail(email: string) {
        if (email) {
            const user: any = await this.cacheManager.get(email);

            if (user) {
                await this.mailService.sendVerify(email, user.verifyID);
                return true;
            }

            return false;
        }
    }
}
