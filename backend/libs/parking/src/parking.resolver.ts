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

    // @UseGuards(GqlAuthGuard)
    @Mutation((returns) => String, { name: "createParking" })
    async createParking(
        @Args("parkingNumber") parkingNumber: number,
    ) {
        //return this.parkingService.createParking(parkingNumber);
        
    }

    // @UseGuards(GqlAuthGuard)
    @Mutation((returns) => String, { name: "reserveParking" })
    async reserveParking(
        @Args("invitationID") invitationID: string,
        @Args("parkingNumber") parkingNumber: number,
    ) {
        return this.parkingService.reserveParking(parkingNumber,invitationID);
    }

    // @UseGuards(GqlAuthGuard)
    @Mutation((returns) => String, { name: "freeParking" })
    async freeParking(
        @Args("parkingNumber") parkingNumber: number,
    ) {
        return this.parkingService.freeParking(parkingNumber);
        
    }

    
}