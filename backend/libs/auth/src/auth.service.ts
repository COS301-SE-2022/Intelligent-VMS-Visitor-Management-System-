import { Injectable } from "@nestjs/common";
import { UserService } from "@vms/user";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { LoginFailed } from "./errors/loginFailed.error";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
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
            };
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
    }
}
