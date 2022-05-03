import { Injectable } from "@nestjs/common";
import { UserService } from "@vms/user";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(email);
        return user;
    }

    async login(user: any) {
        const payload = { email: user.email };

        const validUser = await this.validateUser(user.email, user.password);

        if (validUser !== null) {
            return {
                email: user.email,
                access_token: this.jwtService.sign(payload),
            };
        }
        return "";
    }
}
