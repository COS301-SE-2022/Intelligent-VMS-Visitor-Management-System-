import { UseGuards, Inject, forwardRef } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "@vms/auth";


import { ParkingService } from "./parking.service";

import { Parking } from "./models/parking.model";

@Resolver((of) => Parking)
export class ParkingResolver {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private parkingService: ParkingService,
    ) {}

    //@UseGuards(GqlAuthGuard)
    @Query((returns) => String, { name: "helloParking" })
    async hello() {
        return "👋 from Parking";
    }

}