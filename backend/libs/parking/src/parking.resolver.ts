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

    @Query((returns) => {return Number}, { name: "getTotalAvailableParking" })
    async getTotalAvailableParking() {
        return this.parkingService.getTotalAvailableParking(); 
    }
    @Query((returns) => {return [Parking]}, { name: "getDisabledParking" })
    async getDisabledParking() {
        return this.parkingService.getDisabledParking(); 
    }

    @Query((returns) => {return [Parking]}, { name: "getFreeParking" })
    async getFreeParking() {
        return this.parkingService.getFreeParking();
    }

    @Query((returns) => {return ParkingReservation}, { name: "getReservations" })
    async getReservations(
    ) {
        return this.parkingService.getReservations();
    }

    @Query((returns) => {return ParkingReservation}, { name: "getInviteReservation" })
    async getInviteReservation(
        @Args("invitationID") invitationID: string,
    ) {
        return this.parkingService.getInviteReservation(invitationID);
    }


    @Query((returns) => {return [ParkingReservation]}, { name: "getUsedParkingsInRange" })
    async getUsedParkingsByDate(
        @Args("startDate") startDate: string,
        @Args("endDate") endDate: string,
    ) {
        return this.parkingService.getParkingReservationInRange(startDate,endDate);
    }

    @Query((returns) => { return Boolean }, { name: "isParkingAvailable"})
    async isParkingAvailable(@Args("startDate") startDate: string) {
        return this.parkingService.isParkingAvailable(startDate);
    }

    @Query((returns) => { return Number }, { name: "getNumberOfReservations"})
    async numReservations(@Args("startDate") startDate: string) {
        return this.parkingService.getNumberOfReservations(startDate)
    }

    @Query((returns) => { return Number }, { name: "getTotalParking"})
    async getTotalParking() {
        return this.parkingService.getTotalParking()
    }

    //MUTATIONS
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

    @Mutation((returns) => {return Boolean}, { name: "createNParkingSpots" })
    async createNParkingSpots(
        @Args("N") N: number,
    ) {
        return this.parkingService.createNParkingSpots(N);
    }

    @Mutation((returns) => {return Boolean}, { name: "adjustParking" })
    async adjustParking(
        @Args("parkingNumber") parkingNumber: number,
    ) {
        return this.parkingService.adjustParking(parkingNumber);
    }
    @Mutation((returns) => {return Parking}, { name: "disableParkingSpace" })
    async disableParkingSpace(
        @Args("parkingNumber") parkingNumber: number,
    ) {
        return this.parkingService.disableParkingSpace(parkingNumber);
    }
}
