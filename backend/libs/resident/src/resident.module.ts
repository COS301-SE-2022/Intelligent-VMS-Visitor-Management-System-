import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthModule } from "@vms/auth";

import { ResidentResolver } from "./resident.resolver";
import { ResidentService } from "./resident.service";

@Module({
    imports: [AuthModule, CqrsModule],
    providers: [ResidentResolver, ResidentService],
    exports: [ResidentService],
})
export class ResidentModule {}
