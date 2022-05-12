import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ParkingService } from "./parking.service";

import { GqlAuthGuard } from "@vms/auth/guards/GqlAuthGuard.guard";

import { Parking } from "./models/parking.model";

@Resolver((of) => Parking)
export class ParkingResolver {
    constructor(
        private parkingService: ParkingService,
    ) {}

    @UseGuards(GqlAuthGuard)
    @Query((returns) => String, { name: "helloParking" })
    async hello() {
        return "👋 from Parking";  
    }

    @UseGuards(GqlAuthGuard)
    @Query((returns) => String, { name: "getAvailableParking" })
    async getAvailableParking() {
        return this.parkingService.getAvailableParking(); 
    }

    @UseGuards(GqlAuthGuard)
    @Mutation((returns) => String, { name: "assignParking" })
    async assignParking(
        @Args("parkingNumber") parkingNumber: number,
        @Args("visitorEmail") visitorEmail: string,
    ) {
        return this.parkingService.assignParking(visitorEmail,parkingNumber);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation((returns) => String, { name: "reserveParking" })
    async reserveParking(
        @Args("reservationInviteID") reservationInviteID: string,
        @Args("parkingNumber") parkingNumber: number,
    ) {
        return this.parkingService.reserveParking(parkingNumber,reservationInviteID);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation((returns) => String, { name: "freeParking" })
    async freeParking(
        @Args("parkingNumber") parkingNumber: number,
    ) {
        return this.parkingService.freeParking(parkingNumber);
    }

}
