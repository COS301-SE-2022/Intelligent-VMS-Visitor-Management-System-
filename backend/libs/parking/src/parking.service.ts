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
import { EnableParkingSpaceCommand } from './commands/impl/enableParkingSpace.command';
import { DisableParkingSpaceCommand } from './commands/impl/disableParkingSpace.command';

@Injectable()
export class ParkingService {

    constructor(private commandBus: CommandBus, 
                private queryBus: QueryBus,
                @Inject(forwardRef(() => VisitorInviteService))
                private inviteService: VisitorInviteService) {}

    //////////////////////////////////////COMMANDS

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
    Free the parking space that is no longer in use

    Throws: 
    External error
    Invalid parking number

    Returns: the free'd up parking
    */
    async freeParking(
        parkingNumber: number
    ){
        //Validate input
        const spaces = await this.getAvailableParking();

        if(parkingNumber<0 || parkingNumber>spaces)
            throw new InvalidQuery(`Parking number ${parkingNumber} is out of parking range. Parking range from 0 to ${spaces}`);

        //Send to db
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
    ReservationNotFound

    Returns: the parking assigned to invite
    */
    async assignParking(
        invitationID: string,
    ){
        //Validate input
        const invite = await this.inviteService.getInvite(invitationID);

        if(!invite)
        throw new InviteNotFound(`Invitation with ID ${invitationID} not found`);
    
        //Additional Checks
        const reservation = await this.queryBus.execute(
            new GetInviteReservationQuery(invitationID)
        )

        if(!reservation)
        throw new ReservationNotFound(`Reservation for ${invitationID} not found`);
        
        //Send to db
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
    InviteNotFound
    InvalidQuery
    ParkingNotFound

    Returns: the reserved parking
    */
    async reserveParking(
        invitationID:string
    ){
        //Validate input
        const invite = await this.inviteService.getInvite(invitationID);

        if(!invite)
        throw new InviteNotFound(`Invitation with ID ${invitationID} not found`);

        //Additional Checks
        const InviteReservation = await this.queryBus.execute(
            new GetInviteReservationQuery(invitationID));

        if(InviteReservation)
            throw new InvalidQuery(`Invitation with ID ${invitationID} already have reserved parking.`)
        
        //Find Free Parking
        let parkingNumber = -1;
        let temp = true;
        const spaces = await this.getAvailableParking();

        for(let i=0;i<spaces;i++){
            const reservations = await this.queryBus.execute(
                new GetParkingReservationsQuery(parkingNumber));

            temp = true;
            for(let j=0;j<reservations.length;j++)
            {
                const resInvite = await this.inviteService.getInvite(reservations[j].invitationID);

                if(resInvite && resInvite.inviteDate === invite.inviteDate)
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
            throw new ParkingNotFound("There are no parking available");

        //Send to db
        const parkingReservation = await this.commandBus.execute(
            new ReserveParkingCommand(invitationID,parkingNumber));
          
        if(parkingReservation)
        return parkingReservation;
        else
        throw new ExternalError("Error outside the parking.service");
            
    }

    /*
    Reserve a specific parking space

    Throws:
    InviteNotFound
    InvalidQuery
    ParkingNotFound

    Returns: parking reserved 
    */
    async reserveParkingSpace(
        parkingNumber:number,
        invitationID:string
    ){
        //Validate input
        const invite = await this.inviteService.getInvite(invitationID);

        if(!invite)
        throw new InviteNotFound(`Invitation with ID ${invitationID} not found`);

        const spaces = await this.getAvailableParking();

        // or parking disabled
        if(parkingNumber<0 ||  parkingNumber>spaces)
            throw new InvalidQuery(`Parking number ${parkingNumber} is out of parking range. Parking range from 0 to ${spaces}`);

        //Additional Checks
        const InviteReservation = await this.queryBus.execute(
            new GetInviteReservationQuery(invitationID));

        if(InviteReservation)
            throw new InvalidQuery(`Invitation with ID ${invitationID} already have reserved parking.`)

        const ParkingReservations = await this.queryBus.execute(
            new GetParkingReservationsQuery(parkingNumber)
        )

        //TODO (Kyle) : Is there a more efficient way?
        for(let i=0;i<ParkingReservations.length;i++){
            const resInvite = await this.inviteService.getInvite(ParkingReservations[i].invitationID);
            
            console.log(resInvite.inviteDate);
            console.log(invite.inviteDate);
            if(resInvite.inviteDate === invite.inviteDate)
                throw new InvalidQuery(`Parking number ${parkingNumber} already reserved.`);
        }

        //Send to db
        const parkingReservation = await this.commandBus.execute(
            new ReserveParkingCommand(invitationID,parkingNumber));
        
        if(parkingReservation) {
                return parkingReservation;
            } else {
                throw new ParkingNotFound(`Parking with Number: ${parkingNumber} not found.`);
            }
    }

    /*
    Unreserve the parking for an invite

    Throws:
    InviteNotFound

    Returns: parking unreserved 
    */
    async unreserveParking(
        invitationID:string,
    ){
        //Validate input
        const invite = await this.inviteService.getInvite(invitationID);

        if(!invite)
        throw new InviteNotFound(`Invitation with ID ${invitationID} not found.`);
        
        //Send to db
        await this.commandBus.execute(
            new UnreserveParkingCommand(invitationID));
             
    }

    /*
    Create n amount of new parking spots

    Throws:
    ExternalError
    InvalidQuery

    Returns: array of parking objects 
    */
    async createNParkingSpots(
        N:number,
    ){
        //Validate input
        if(N<0)
            throw new InvalidQuery(`Cannot create ${N} number of parking spots.`)

        //Send to db
        const parking = await this.commandBus.execute(
            new CreateNParkingSpotsCommand(N));
        
        if(parking) 
            return parking;
         else 
            throw new ExternalError("Error outside the parking.service.");
            
    }

    /*
    Enable a parking spot allowing visitors to use it

    Throws:
    ExternalError
    InvalidQuery

    Returns: enabled parking object
    */
    async enableParkingSpace(
        parkingNumber:number,
    ){
        //Validate input
        const spaces = await this.getAvailableParking();

        // or parking disabled
        if(parkingNumber<0 ||  parkingNumber>spaces)
            throw new InvalidQuery(`Parking number ${parkingNumber} is out of parking range. Parking range from 0 to ${spaces}`);

        //Send to db
        const parking = await this.commandBus.execute(
            new EnableParkingSpaceCommand(parkingNumber));
        
        if(parking) 
            return parking;
         else 
            throw new ExternalError("Error outside the parking.service.");
            
    }

    /*
    Disable a parking spot allowing visitors to use it

    Throws:
    ExternalError
    InvalidQuery

    Returns: enabled parking object
    */
    async disableParkingSpace(
        parkingNumber:number,
    ){
        //Validate input
        const spaces = await this.getAvailableParking();

        // or parking disabled
        if(parkingNumber<0 ||  parkingNumber>spaces)
            throw new InvalidQuery(`Parking number ${parkingNumber} is out of parking range. Parking range from 0 to ${spaces}`);

        //Send to db
        const parking = await this.commandBus.execute(
            new DisableParkingSpaceCommand(parkingNumber));
        
        if(parking) 
            return parking;
         else 
            throw new ExternalError("Error outside the parking.service.");
            
    }

    //////////////////////////////////////QUERIES

    /*
    Returns all parking that have not been assigned yet

    Throws:
    ExternalError
    ParkingNotFound

    Returns: array of parking that aren't assigned
    */
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

    /*
    Return all parking reservations made

    Throws:
    ExternalError
    ParkingNotFound

    Returns: an array of parking reservations
    */
    async getReservations(
        ){
            const parkings = await this.queryBus.execute(
                new GetReservationsQuery());
    
            if(parkings)
            {
                if(parkings.length > 0) 
                    return parkings;
                else
                    throw new ReservationNotFound("No Reserved parkings")
    
            }else 
                throw new ExternalError("Error outside the parking.service");
                
    }

    /*
    Return all reservations of a specific parking space

    Throws:
    ExternalError
    InvalidQuery
    ParkingNotFound

    Returns: an array of reservations for a specific parking space 
    */
    //TODO (Larisa) check parking num in another way?
    async getParkingReservations(
        parkingNumber: number,
        ){
            const spaces = await this.getAvailableParking();

            // or parking disabled
            if(parkingNumber<0 ||  parkingNumber>spaces)
            throw new InvalidQuery(`Parking number ${parkingNumber} is out of parking range. Parking range from 0 to ${spaces}`);

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

    /*
    Return the reservation of a specific invite

    Throws:
    InviteNotFound
    ParkingNotFound

    Returns: the reservation for a specific invitation
    */
    async getInviteReservation(
        invitationID: string,
        ){
            const invite = await this.inviteService.getInvite(invitationID);

            if(!invite)
            throw new InviteNotFound(`Invitation with ID ${invitationID} not found.`);

            const reservation = await this.queryBus.execute(
                new GetInviteReservationQuery(invitationID));
    
            if(reservation)
            {
                return reservation;
            }else 
                throw new ParkingNotFound(`No reservations for invitation :${invitationID}`)
                
    }

    /*
    Get the amount of visitor parking available for use

    Throws: External error
    Returns: amount of available parking

    Note: This does not return unreserved or free parking only spaces regardless their state
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

    async getUsedParkingInRange(
        startDate: string,
        endDate: string
    ){
        let count = 0;
        let amount = [];
        let dates = [];

        const Reservations = await this.queryBus.execute(
            new GetReservationsQuery()
        )

        var end = new Date(endDate);

        var loop = new Date(startDate);
            while(loop <= end){    
                dates[count]= loop; 
                amount[count]= 0;  
                var newDate = loop.setDate(loop.getDate() + 1);
                loop = new Date(newDate);
                count++;
            }

        for(let i=0;i<Reservations.length;i++){
            
            const resInvite = await this.inviteService.getInvite(Reservations[i].invitationID);

            let resDate = new Date(resInvite.inviteDate);
            for(let j=0;j<count;j++){
                if(resDate.getTime() === dates[j].getTime())
                    amount[j] = amount[j]+1;
            }
        }

        return amount;

    }

    //TODO (Larisa): Check doubles ie double reservation
    //TODO (Larisa) : Add disable and enable parking commands
    //TODO (Larisa): Test all errors
    
}
