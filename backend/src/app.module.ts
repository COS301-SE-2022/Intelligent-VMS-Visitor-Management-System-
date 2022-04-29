import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { DirectiveLocation, GraphQLDirective } from "graphql";

import { DatabaseModule } from "@vms/database";
import { VisitorModule } from "@vms/visitor";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            debug: false,
            playground: true,
            autoSchemaFile: join(process.cwd(), "src/schema.gql"),
            installSubscriptionHandlers: true,
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
        VisitorModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
