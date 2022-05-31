import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ParkingService } from "./parking.service";

import { GqlAuthGuard } from "@vms/auth/guards/GqlAuthGuard.guard";

import { Parking } from "./models/parking.model";
import { ParkingReservation } from "./models/reservation.model";

//@UseGuards(GqlAuthGuard)
@Resolver((of) => Parking)
export class ParkingResolver {
    constructor(
        private parkingService: ParkingService,
    ) {}

    //QUERIES

    @Query((returns) => String, { name: "helloParking" })
    async hello() {
        return "👋 from Parking";  
    }

    @Query((returns) => Number, { name: "getAvailableParking" })
    async getAvailableParking() {
        return this.parkingService.getAvailableParking(); 
    }

    @Query((returns) => Parking, { name: "getFreeParking" })
    async getFreeParking(
    ) {
        return this.parkingService.getFreeParking();
    }

    @Query((returns) => ParkingReservation, { name: "getReservations" })
    async getReservations(
    ) {
        return this.parkingService.getReservations();
    }

    @Query((returns) => Number, { name: "getAmountOfUsedParkingsByDate" })
    async getAmountOfUsedParkingsByDate(
        @Args("date") date: Date,
    ) {
        return this.parkingService.getTotalUsedParkingByDate(date);
    }

    //MUTATION

    @Mutation((returns) => Parking, { name: "assignParking" })
    async assignParking(
        @Args("invitationID") invitationID: string,
    ) {
        return this.parkingService.assignParking(invitationID);
    }

    @Mutation((returns) => ParkingReservation, { name: "reserveParkingSpace" })
    async reserveParkingSpace(
        @Args("invitationID") invitationID: string,
        @Args("parkingNumber") parkingNumber: number,
    ) {
        return this.parkingService.reserveParkingSpace(parkingNumber,invitationID);
    }

    @Mutation((returns) => ParkingReservation, { name: "reserveParking" })
    async reserveParking(
        @Args("invitationID") invitationID: string,
    ) {
        return this.parkingService.reserveParking(invitationID);
    }

    @Mutation((returns) => Boolean, { name: "unreservedParking" })
    async unreserveParking(
        @Args("invitationID") invitationID: string,
    ) {
        return this.parkingService.unreserveParking(invitationID);
    }

    @Mutation((returns) => Parking, { name: "freeParking" })
    async freeParking(
        @Args("parkingNumber") parkingNumber: number,
    ) {
        return this.parkingService.freeParking(parkingNumber);
    }

    @Mutation((returns) => Boolean, { name: "ceatedParkings" })
    async createNParkingSpots(
        @Args("N") N: number,
    ) {
        return this.parkingService.createNParkingSpots(N);
    }

    

}
