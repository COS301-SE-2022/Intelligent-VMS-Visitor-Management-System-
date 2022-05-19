import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AssignParkingCommand } from './commands/impl/assignParking.command';
import { FreeParkingCommand } from './commands/impl/freeParking.command';
import { ReserveParkingCommand } from './commands/impl/reserveParking.command';
import { ParkingNotFound } from "./errors/parkingNotFound.error";
import { GetAvailableParkingQuery } from './queries/impl/getAvailableParking.query';
import { GetFreeParkingQuery } from './queries/impl/getFreeParking.query';
import { UnreserveParkingCommand } from './commands/impl/unreserveParking.command';
import { AddParkingCommand } from './commands/impl/addParking.command';
import { ExternalError } from './errors/externalError.error';
import { VisitorInviteService } from '@vms/visitor-invite';
import { InvalidParkingNumber } from './errors/invalidParkingNumber.error';
import { GetInviteReservationQuery } from './queries/impl/getInviteReservation.query';
import { CreateNParkingSpotsCommand } from './commands/impl/createNParkingSpots.command';
import { InviteNotFound } from '@vms/visitor-invite/errors/inviteNotFound.error';
import { GetReservedParkingQuery } from './queries/impl/getReservedParking.query';

@Injectable()
export class ParkingService {
    constructor(private commandBus: CommandBus, 
                private queryBus: QueryBus,
                @Inject(forwardRef(() => VisitorInviteService))
                private inviteService: VisitorInviteService) {}

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
            //for testing purposes
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

    Returns: the free'd up parking
    */
    async freeParking(
        parkingNumber: number
    ){
        const spaces = await this.getAvailableParking();

        if(parkingNumber<0 || parkingNumber>spaces)
            throw new InvalidParkingNumber(`Parking number ${parkingNumber} is out of parking range. Parking range from 0 to ${spaces}`);

        const parking =  this.commandBus.execute(
            new FreeParkingCommand(parkingNumber)
        )

        if(parking) {
            return parking;
        } else {
            throw new ExternalError("Error outside the parking.service");
        }
    }
    /*
    Use the invitation to assign the reserved parking

    Throws:
    External Error
    InviteNotFound

    Returns:
    Parking assigned
    */
    async assignParking(
        invitationID: string,
    ){
    
        const reservation = await this.queryBus.execute(
            new GetInviteReservationQuery(invitationID)
        )
        
        const invite = await this.inviteService.getInvite(invitationID);

        if(!invite)
        throw new InviteNotFound(`Invitation with ID ${invitationID} not found`);

        const parking = await this.commandBus.execute(
            new AssignParkingCommand(invite.visitorEmail, reservation.parkingNumber)
        )

        if(parking){
            return parking;
        } else {
            throw new ExternalError("Error outside the parking.service");
        }
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
        //TODO (Larisa) Check invite Date
        const parkingSpaces =await this.queryBus.execute(
            new GetFreeParkingQuery()
        );

        if(parkingSpaces.length == 0)
            throw new ParkingNotFound("There are no parking available")

        const firstSpaceNr = parkingSpaces[0].parkingNumber;

        const parking = await this.commandBus.execute(
            new ReserveParkingCommand(invitationID,firstSpaceNr));
          
        if(parking)
        return parking;
        else
        throw new ExternalError("Error outside the parking.service");
            
    }

    /*
    Reserve a parking space

    Returns: parking reserved 
    */
    async reserveParkingSpace(
        parkingNumber:number,
        invitationID:string
    ){
        const spaces = await this.getAvailableParking();

        //TODO (Larisa) : Add disable and enable parking commands
        // or parking disabled
        if(parkingNumber<0 ||  parkingNumber>spaces)
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
        invitationID:string,
    ){
        //TODO (Larisa) : Add checks
        await this.commandBus.execute(
            new UnreserveParkingCommand(invitationID));
             
    }

    async createNParkingSpots(
        N:number,
    ){
        //TODO (Larisa)
        if(N<0)
            console.log("Invalid N");

        const parking = await this.commandBus.execute(
            new CreateNParkingSpotsCommand(N));
        
        if(parking) 
            return parking;
         else 
            throw new ExternalError("Error outside the parking.service");
            
    }

    async getFreeParking(
    ){
        const parkings = await this.queryBus.execute(
            new GetFreeParkingQuery());

        if(parkings)
        {
            if(parkings.length > 0) 
                return parkings.length;
            else
                throw new ParkingNotFound("No Free parkings")

        }else 
            throw new ExternalError("Error outside the parking.service");
            
    }

    async getReservedParking(
        ){
            const parkings = await this.queryBus.execute(
                new GetReservedParkingQuery());
    
            if(parkings)
            {
                if(parkings.length > 0) 
                    return parkings.length;
                else
                    throw new ParkingNotFound("No Reserved parkings")
    
            }else 
                throw new ExternalError("Error outside the parking.service");
                
        }

    //TODO (Larisa): Check doubles ie double reservation
    
}
