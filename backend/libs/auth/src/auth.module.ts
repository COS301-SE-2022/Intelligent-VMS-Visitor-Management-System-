import { Module, forwardRef, CacheModule } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { UserModule } from "@vms/user";
import {MailService} from "@vms/mail";

import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule,
        CacheModule.register(),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
                signOptions: { expiresIn: "1h" },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, MailService, JwtStrategy, LocalStrategy],
    exports: [AuthService],
})
export class AuthModule {}
