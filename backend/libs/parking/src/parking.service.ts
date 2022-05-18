import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AssignParkingCommand } from './commands/impl/assignParking.command';
import { FreeParkingCommand } from './commands/impl/freeParking.command';
import { ReserveParkingCommand } from './commands/impl/reserveParking.command';
import { ParkingNotFound } from "./errors/parkingNotFound.error";
<<<<<<< HEAD
import { GetAvailableParkingQuery } from './queries/impl/getAvailableParking.query';
import { GetFreeParkingQuery } from './queries/impl/getFreeParking.query';
import { UnreserveParkingCommand } from './commands/impl/unreserveParking.command';
import { AddParkingCommand } from './commands/impl/addParking.command';
import { ExternalError } from './errors/externalError.error';
import { VisitorInviteService } from '@vms/visitor-invite';
import { NoParkingFound } from './errors/noParkingFound.error';
=======
import { getAvailableParkingQuery } from './queries/impl/getAvailableParking.query';
>>>>>>> develop

@Injectable()
export class ParkingService {
    constructor(private commandBus: CommandBus, 
                private queryBus: QueryBus,
                private inviteService: VisitorInviteService) {}

<<<<<<< HEAD
    /*
    Create more visitor parking

    Throws: External error
    Returns: new parking object
    */
    async addParking(
    ){
        const parking = await this.commandBus.execute(
            new AddParkingCommand()
        );

        if(parking)
            return parking;
        else
            throw new ExternalError("Error outside the parking.service");

    }

    /*
    Get the amount of visitor parking available for use

    Throws: External error
    Returns: amount of available parking
    */
    async getAvailableParking(
    ){
        const amount = this.queryBus.execute(
            new GetAvailableParkingQuery()
=======
    async getAvailableParking(){
        return this.queryBus.execute(
            new getAvailableParkingQuery()
>>>>>>> develop
        )

        if(amount)
            return amount;
        else
            throw new ExternalError("Error outside the parking.service");
    }

    /*
    Free the parking space that is no longer in use

    Throws: 
    External error
    Invalid parking number
    *Already free error

    Returns: the free'd up parking
    */
    async freeParking(
        parkingNumber: number
    ){
        const parking =  this.commandBus.execute(
            new FreeParkingCommand(parkingNumber)
        )

        if(parking) {
<<<<<<< HEAD
            return parking;
=======
            return true;
>>>>>>> develop
        } else {
            throw new ParkingNotFound(`Parking with Number: ${parkingNumber} not found`);
        }
    }
    /*
    Use the invitation to assign the reserved parking
    */
    async assignParking(
        invitationID: string,
    ){
    
        /*this.inviteService.getInvite()
        const parking = this.commandBus.execute(
            new AssignParkingCommand(visitorEmail,parkingNumber)
         )

        if(parking){
<<<<<<< HEAD
            return parking;
=======
            return true;
>>>>>>> develop
        } else {
            throw new ParkingNotFound(`Parking with Number: ${parkingNumber} not found`);
        }*/
     }

    /*
    Reserve the first open parking space

    Throws:
    External error

    Returns: parking reserved

    */
    async reserveParking(
        invitationID:string
    ){
        const parkingSpaces =await this.queryBus.execute(
            new GetFreeParkingQuery()
        );

        if(parkingSpaces.length == 0)
            throw new NoParkingFound("There are no parking available")

        const firstSpaceNr = parkingSpaces[0].parkingNumber;

        const parking = await this.commandBus.execute(
            new ReserveParkingCommand(invitationID,firstSpaceNr));
          
        if(parking)
        return parking;
        else
        return -1;
            
    }

    /*
    Reserve a parking space

    Returns parking reserved 
    */
   //TODO (Larisa) add specific errors
    async reserveParkingSpace(
        parkingNumber:number,
        invitationID:string
    ){
        const availNum = await this.queryBus.execute( 
            new GetAvailableParkingQuery());

        // or parking disabled
        if(parkingNumber<0 ||  parkingNumber>availNum)
            throw new ParkingNotFound(`Parking Number is invalid`);

        const parking = await this.commandBus.execute(
            new ReserveParkingCommand(invitationID,parkingNumber));
        
        if(parking) {
                return parking;
            } else {
                throw new ParkingNotFound(`Parking with Number: ${parkingNumber} not found`);
            }
    }

    async unreserveParking(
        parkingNumber:number,
    ){
        const parking = await this.commandBus.execute(
            new UnreserveParkingCommand(parkingNumber));
        
        if(parking) {
                return parking;
            } else {
                throw new ParkingNotFound(`Parking with Number: ${parkingNumber} not found`);
            }
    }

}
