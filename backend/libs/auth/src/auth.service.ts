import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from 'cache-manager';
import { UserService } from "@vms/user";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";

import { LoginFailed } from "./errors/loginFailed.error";
import { SignUpFailed } from "./errors/signupFailed.error";
import { MailService } from "@vms/mail";
import {VerificationFailed} from "./errors/verificationFailed.error";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private mailService: MailService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

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
            const payload = {
                email: user.email,
                permission: validUser.permission,
                name: validUser.name
            };
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
    }

    async signup(user: any) {
        const emailUser = await this.userService.findOne(user.email);
        
        if(emailUser === null) {
            if(await this.cacheManager.get(user.email) === undefined) {
                const hashPass = await bcrypt.hash(user.password, 3);            
                let permission = 0;
                    
                if(user.type === "resident") {
                    permission = -2;
                } else if(user.type === "receptionist") {
                    permission = -1;
                } else if(user.type === "admin") {
                    permission = 5;
                } else {
                    throw new SignUpFailed("Invalid User Type Provided");
                }

                const verifyID = randomUUID();
                
                await this.cacheManager.set(user.email, {
                    email: user.email,
                    password: hashPass,
                    confirmationPin:user.confirmationPin,
                    permission: permission,
                    idNumber: user.idNumber,
                    name: user.name,
                    idDocType: user.idDocType,
                    verifyID: verifyID,
                }, { ttl: 1000 });

                this.mailService.sendVerify(user.email, verifyID);

                return true;
            }

            throw new SignUpFailed("User is already signed up");
        }    
        
        throw new SignUpFailed("User already exists");
    }

    async verifyNewAccount(verifyID: string, email: string) {
        if(/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/.test(verifyID)) {
            const user: any = (await this.cacheManager.get(email));
            if(user !== undefined) {
                if(user.verifyID === verifyID) {
                    await this.cacheManager.del(email);
                    await this.userService.createUser(user.email, user.password, user.permission, user.idNumber, user.idDocType, user.name);
                    return true;
                }
                throw new VerificationFailed("Invalid Verification ID given");
            }

            throw new VerificationFailed("Email Not Found, please signup again");
        }

        throw new VerificationFailed("Invalid verification ID");
    }
}
