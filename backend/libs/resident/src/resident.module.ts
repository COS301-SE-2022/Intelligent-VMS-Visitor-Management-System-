import { Module } from "@nestjs/common";

import { AuthModule } from "@vms/auth";

import { ResidentResolver } from "./resident.resolver";
import { ResidentService } from "./resident.service";

@Module({
    imports: [AuthModule],
    providers: [ResidentResolver, ResidentService],
    exports: [ResidentService],
})
export class ResidentModule {}
