import { CacheModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { DirectiveLocation, GraphQLDirective } from "graphql";

import { DatabaseModule } from "@vms/database";
import { AuthModule } from "@vms/auth";
import { UserModule } from "@vms/user";
import { VisitorInviteModule } from "@vms/visitor-invite";
import { ResidentModule } from "@vms/resident";
import { ParkingModule } from "@vms/parking";
import { MailModule } from "@vms/mail";
import { ReceptionistModule } from "@vms/receptionist";
import { RestrictionsModule } from "@vms/restrictions";
import { RewardsModule } from '@vms/rewards';

@Module({
    imports: [
        CacheModule.register(),
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({ isGlobal: true }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            debug: false,
            playground: true,
            autoSchemaFile: join(process.cwd(), "src/schema.gql"),
            installSubscriptionHandlers: true,
            context: ({ req }) => {return ({ req })},
            buildSchemaOptions: {
                directives: [
                    new GraphQLDirective({
                        name: "upper",
                        locations: [DirectiveLocation.FIELD_DEFINITION],
                    }),
                ],
            },
        }),
        DatabaseModule,
        UserModule,
        AuthModule,
        ResidentModule,
        ParkingModule,
        MailModule,
        ReceptionistModule,
        RestrictionsModule,
        RewardsModule,
        VisitorInviteModule,
        
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
