import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ParkingService } from "./parking.service";

import { GqlAuthGuard } from "@vms/auth/guards/GqlAuthGuard.guard";

import { Parking } from "./models/parking.model";
import { ParkingReservation } from "./models/reservation.model";

//@UseGuards(GqlAuthGuard)
@Resolver((of) => {return Parking})
export class ParkingResolver {
    constructor(
        private parkingService: ParkingService,
    ) {}

    //QUERIES

    @Query((returns) => {return String}, { name: "helloParking" })
    async hello() {
        return "👋 from Parking";  
    }

    @Query((returns) => {return Number}, { name: "getAvailableParking" })
    async getAvailableParking() {
        return this.parkingService.getAvailableParking(); 
    }

    @Query((returns) => {return Parking}, { name: "getFreeParking" })
    async getFreeParking(
    ) {
        return this.parkingService.getFreeParking();
    }

    @Query((returns) => {return ParkingReservation}, { name: "getReservations" })
    async getReservations(
    ) {
        return this.parkingService.getReservations();
    }

    @Query((returns) => {return [ParkingReservation]}, { name: "getAmountOfUsedParkingsInRange" })
    async getAmountOfUsedParkingsByDate(
        @Args("startDate") startDate: string,
        @Args("endDate") endDate: string,
    ) {
        return this.parkingService.getTotalUsedParkingInRange(startDate,endDate);
    }

    //MUTATION
    @Mutation((returns) => {return Parking}, { name: "assignParking" })
    async assignParking(
        @Args("invitationID") invitationID: string,
    ) {
        return this.parkingService.assignParking(invitationID);
    }

    @Mutation((returns) => {return ParkingReservation}, { name: "reserveParkingSpace" })
    async reserveParkingSpace(
        @Args("invitationID") invitationID: string,
        @Args("parkingNumber") parkingNumber: number,
    ) {
        return this.parkingService.reserveParkingSpace(parkingNumber,invitationID);
    }

    @Mutation((returns) => {return ParkingReservation}, { name: "reserveParking" })
    async reserveParking(
        @Args("invitationID") invitationID: string,
    ) {
        return this.parkingService.reserveParking(invitationID);
    }

    @Mutation((returns) => {return Boolean}, { name: "unreservedParking" })
    async unreserveParking(
        @Args("invitationID") invitationID: string,
    ) {
        return this.parkingService.unreserveParking(invitationID);
    }

    @Mutation((returns) => {return Parking}, { name: "freeParking" })
    async freeParking(
        @Args("parkingNumber") parkingNumber: number,
    ) {
        return this.parkingService.freeParking(parkingNumber);
    }

    @Mutation((returns) => {return Boolean}, { name: "ceatedParkings" })
    async createNParkingSpots(
        @Args("N") N: number,
    ) {
        return this.parkingService.createNParkingSpots(N);
    }

    

}
