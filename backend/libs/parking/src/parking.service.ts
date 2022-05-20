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
import { VisitorInviteService } from '@vms/visitor-invite/visitor-invite.service';
import { InvalidQuery } from './errors/invalidQuery.error';
import { GetInviteReservationQuery } from './queries/impl/getInviteReservation.query';
import { CreateNParkingSpotsCommand } from './commands/impl/createNParkingSpots.command';
import { InviteNotFound } from '@vms/visitor-invite/errors/inviteNotFound.error';
import { ReservationNotFound } from './errors/reservationNotFound.error';
import { GetReservationsQuery } from './queries/impl/getReservations.query';
import { GetParkingReservationsQuery } from './queries/impl/getParkingReservations.query';

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
            throw new InvalidQuery(`Parking number ${parkingNumber} is out of parking range. Parking range from 0 to ${spaces}`);

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
        
        const invite = await this.inviteService.getInvite(invitationID);

        if(!invite)
        throw new InviteNotFound(`Invitation with ID ${invitationID} not found`);
    
        const reservation = await this.queryBus.execute(
            new GetInviteReservationQuery(invitationID)
        )

        if(!reservation)
        throw new ReservationNotFound(`Reservation for ${invitationID} not found`);
        

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
        const invite = await this.inviteService.getInvite(invitationID);
        
        let parkingNumber = -1;
        let temp = true;
        const spaces = await this.getAvailableParking();

        for(let i=0;i<spaces;i++){
            const reservations = await this.getParkingReservations(i);
            
            temp = true;
            for(let j=0;j<reservations.length;j++)
            {
                const resInvite = await this.inviteService.getInvite(reservations[j].invitationID);

                if(resInvite.visitDate == invite.visitDate)
                {
                    temp =false;
                    break;
                }
            }

            if(temp)
            {
                parkingNumber = i;
                break;
            }
        }

        if(parkingNumber == -1)
            throw new ParkingNotFound("There are no parking available")

        const parking = await this.commandBus.execute(
            new ReserveParkingCommand(invitationID,parkingNumber));
          
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

        const invite = await this.inviteService.getInvite(invitationID);

        const InviteReservations = await this.queryBus.execute(
            new GetInviteReservationQuery(invitationID));

        const spaces = await this.getAvailableParking();

        // or parking disabled
        if(parkingNumber<0 ||  parkingNumber>spaces)
            throw new ParkingNotFound(`Parking Number is invalid.`);

        if(InviteReservations.length != 0)
            throw new InvalidQuery(`Invitation with ID ${invitationID} already have reserved parking.`)

        const ParkingReservations = await this.queryBus.execute(
            new GetParkingReservationsQuery(parkingNumber)
        )

        //TODO (Kyle) : Is there a more efficient way?
        for(let i=0;i<ParkingReservations.length;i++){
            const resInvite = await this.inviteService.getInvite(ParkingReservations[i].invitationID);
            
            if(resInvite.visitDate == invite.visitDate)
                throw new InvalidQuery(`Parking number ${parkingNumber} already reserved.`);
        }

        const parking = await this.commandBus.execute(
            new ReserveParkingCommand(invitationID,parkingNumber));
        
        if(parking) {
                return parking;
            } else {
                throw new ParkingNotFound(`Parking with Number: ${parkingNumber} not found.`);
            }
    }

    async unreserveParking(
        invitationID:string,
    ){
        const invite = await this.inviteService.getInvite(invitationID);

        if(!invite)
        throw new InviteNotFound(`Invitation with ID ${invitationID} not found.`);
        
        await this.commandBus.execute(
            new UnreserveParkingCommand(invitationID));
             
    }

    async createNParkingSpots(
        N:number,
    ){
        if(N<0)
            throw new InvalidQuery(`Cannot create ${N} number of parking spots.`)

        const parking = await this.commandBus.execute(
            new CreateNParkingSpotsCommand(N));
        
        if(parking) 
            return parking;
         else 
            throw new ExternalError("Error outside the parking.service.");
            
    }

    async getFreeParking(
    ){
        const parkings = await this.queryBus.execute(
            new GetFreeParkingQuery());

        if(parkings)
        {
            if(parkings.length > 0) 
                return parkings;
            else
                throw new ParkingNotFound("No Free parkings.")

        }else 
            throw new ExternalError("Error outside the parking.service.");
            
    }

    async getReservations(
        ){
            const parkings = await this.queryBus.execute(
                new GetReservationsQuery());
    
            if(parkings)
            {
                if(parkings.length > 0) 
                    return parkings;
                else
                    throw new ParkingNotFound("No Reserved parkings")
    
            }else 
                throw new ExternalError("Error outside the parking.service");
                
    }

    async getParkingReservations(
        parkingNumber: number,
        ){
            const reservations = await this.queryBus.execute(
                new GetParkingReservationsQuery(parkingNumber));
    
            if(reservations)
            {
                if(reservations.length > 0) 
                    return reservations;
                else
                    throw new ParkingNotFound(`No reservations for parking number :${parkingNumber}`)
    
            }else 
                throw new ExternalError("Error outside the parking.service");
                
    }

    async getInviteReservations(
        invitationID: string,
        ){
            const reservations = await this.queryBus.execute(
                new GetInviteReservationQuery(invitationID));
    
            if(reservations)
            {
                if(reservations.length > 0) 
                    return reservations;
                else
                    throw new ParkingNotFound(`No reservations for invitation :${invitationID}`)
    
            }else 
                throw new ExternalError("Error outside the parking.service");
                
    }

    //TODO (Larisa): Check doubles ie double reservation
    //TODO (Larisa) : Add disable and enable parking commands
    
}
