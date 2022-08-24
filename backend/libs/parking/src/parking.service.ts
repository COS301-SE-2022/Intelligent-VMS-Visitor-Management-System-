import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AssignParkingCommand } from './commands/impl/assignParking.command';
import { FreeParkingCommand } from './commands/impl/freeParking.command';
import { ReserveParkingCommand } from './commands/impl/reserveParking.command';
import { EnableParkingSpaceCommand } from './commands/impl/enableParkingSpace.command';
import { DisableParkingSpaceCommand } from './commands/impl/disableParkingSpace.command';
import { UnreserveParkingCommand } from './commands/impl/unreserveParking.command';
import { CreateNParkingSpotsCommand } from './commands/impl/createNParkingSpots.command';
import { AddParkingCommand } from './commands/impl/addParking.command';
import { getAvailableParkingQuery } from "./queries/impl/getAvailableParking.query";
import { getDisabledParkingQuery  } from "./queries/impl/getDisabledParking.query"
import { getTotalAvailableParkingQuery } from './queries/impl/getTotalAvailableParking.query';
import { getTotalParkingQuery } from "./queries/impl/getTotalParking.query";
import { GetFreeParkingQuery } from './queries/impl/getFreeParking.query';
import { GetInviteReservationQuery } from './queries/impl/getInviteReservation.query';
import { GetReservationsQuery } from './queries/impl/getReservations.query';
import { GetParkingReservationsQuery } from './queries/impl/getParkingReservations.query';
import { GetReservationsInRangeQuery } from "./queries/impl/getReservationsInRange.query";
import { InvalidQuery } from "./errors/invalidQuery.error";
import { ReservationNotFound } from "./errors/reservationNotFound.error";
import { ParkingNotFound } from "./errors/parkingNotFound.error";
import { ExternalError } from "./errors/externalError.error";
import { InviteNotFound } from "@vms/visitor-invite/errors/inviteNotFound.error";
import { VisitorInviteService } from "@vms/visitor-invite/visitor-invite.service";
import { GetParkingQuery } from "./queries/impl/getParking.query";
import { GetReservationsByDateQuery } from "./queries/impl/getReservationsByDate.query";
import { InvalidCommand } from "./errors/invalidCommand.error";
import { GetNumberOfReservationsQuery } from "./queries/impl/getNumberOfReservations.query";

@Injectable()
export class ParkingService {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
        @Inject(
            forwardRef(() => {
                return VisitorInviteService;
            }),
        )
        private inviteService: VisitorInviteService,
    ) {}

    /*
    Create more visitor parking

    Throws: ExternalError
    Returns: new parking object

    Status: Done
    */
    async addParking() {
        const parking = await this.commandBus.execute(new AddParkingCommand());

        if (parking) return parking;
        //for testing purposes
        else throw new ExternalError("Error outside the parking.service");
    }

    /*
    Free the parking space that is no longer in use

    Throws: 
    ExternalError
    InvalidCommand

    Returns: the free'd up parking

    Status: Done
    */
    async freeParking(parkingNumber: number) {
        //Validate input
        const spaces = await this.getTotalParking();

        if (parkingNumber < 0 || parkingNumber > spaces)
            throw new InvalidCommand(
                `Parking number ${parkingNumber} is out of parking range. Parking range from 0 to ${spaces}`,
            );

        //Send to db
        const parking = this.commandBus.execute(
            new FreeParkingCommand(parkingNumber),
        );

        if (parking) return parking;
        else throw new ExternalError("Error outside the parking.service");
    }

        /*
    Adjusts the parking spots in the database

    Throws: 
    Returns: a bool for now

    Status: Done
    */

    async adjustParking(numDisiredParkingTotal: number) {
        //Validate input
        const spaces = await this.queryBus.execute(
            new getTotalParkingQuery(),
        );
        const spacesEnabled = await this.queryBus.execute(
            new getTotalAvailableParkingQuery(),
        );
        const listOfDisabled = await this.queryBus.execute(
            new getDisabledParkingQuery(),
        );
        const listOfAvailable=await this.queryBus.execute(
            new getAvailableParkingQuery(),
        );
        //let spacesDisabled=spaces-spacesEnabled;
        let difference=spacesEnabled-numDisiredParkingTotal;

        if (difference>0) {//------------------------------------------ decrease available parking
            for (let index = 0; index < listOfAvailable.length&&index<difference; index++) {
               
                let disableIndex = listOfAvailable[index].parkingNumber;
                this.disableParkingSpace(disableIndex);
            }
         
        } else if (difference<0) {//------------------------------------increase available parking 
            if (numDisiredParkingTotal>spaces) { //Increase overall total spaces
                console.log("here");
                let totalToCreate=numDisiredParkingTotal-spaces;
                for (let index = 0; index < listOfDisabled.length; index++) {//re-enable all disabled parking
                             let enableIndex = listOfDisabled[index].parkingNumber;
                             this.enableParkingSpace(enableIndex);
                }
                this.createNParkingSpots(totalToCreate);
            } else { //overall total stays the same
                let totalToEnable=difference*=-1;
                for (let index = 0; index < listOfDisabled.length&&index<totalToEnable; index++) {//re-enable all disabled parking
                    let enableIndex = listOfDisabled[index].parkingNumber;
                    this.enableParkingSpace(enableIndex);
                }
            }
           
        }
        return true;

    }

    /*
    Use the invitation to assign the reserved parking

    Throws:
    ExternalError
    InviteNotFound
    ReservationNotFound

    Returns: the parking assigned to invite

    Status: Done
    */
    async assignParking(invitationID: string) {
        //Validate input
        const invite = await this.inviteService.getInvite(invitationID);

        if (!invite)
            throw new InviteNotFound(
                `Invitation with ID ${invitationID} not found`,
            );

        //Additional Checks
        const reservation = await this.queryBus.execute(
            new GetInviteReservationQuery(invitationID),
        );

        if (!reservation)
            throw new ReservationNotFound(
                `Reservation for ${invitationID} not found`,
            );

        //Send to db
        const parking = await this.commandBus.execute(
            new AssignParkingCommand(
                invite.visitorEmail,
                reservation.parkingNumber,
            ),
        );

        if (parking) return parking;
        else throw new ExternalError("Error outside the parking.service");
    }

    /*
    Reserve the first open parking space

    Throws: 
    External error
    InviteNotFound
    InvalidCommand
    ParkingNotFound

    Returns: the reserved parking

    Status: Still need 1 test case ( when no free parking available )
    */
    async reserveParking(
        invitationID:string
    ){
        /*
        const now = new Date();
        const year = now.getFullYear();
        let month = "" + (now.getMonth() + 1);
        let day = "" + now.getDate();

        if (month.length < 2) {
            month = "0" + month;
        }

        if (day.length < 2) {
            day = "0" + day;
        }

        const currDate = [year, month, day].join("-");

        const isParkingAvailable = await this.isParkingAvailable(
            currDate,
        );

        if (!isParkingAvailable) {
            throw new InvalidCommand("Parking not available");
        }
        */

        //Validate input
        const invite = await this.inviteService.getInvite(invitationID);   

        if (!invite) {
            throw new InviteNotFound(
                `Invitation with ID ${invitationID} not found`,
            );
        }

        //Additional Checks
        const InviteReservation = await this.queryBus.execute(
            new GetInviteReservationQuery(invitationID),
        );

        if (InviteReservation) {
            throw new InvalidCommand(
                `Invitation with ID ${invitationID} already have reserved parking.`,
            );
        }

        //Find Free Parking
        let parkingNumber = -1;
        let temp = true;
        const spaces = await this.getAvailableParking();

        for (let i = 0; i < spaces; i++) {
            const reservations = await this.queryBus.execute(
                new GetParkingReservationsQuery(parkingNumber),
            );

            temp = true;
            for (let j = 0; j < reservations.length; j++) {
                const resInvite = await this.inviteService.getInvite(
                    reservations[j].invitationID,
                );
                if (resInvite && resInvite.inviteDate === invite.inviteDate) {
                    temp = false;
                    break;
                }
            }

            if (temp) {
                parkingNumber = i;
                break;
            }
        }

        /*
        if (parkingNumber == -1) {
            throw new ParkingNotFound("There is no parking available");
        }
        */

        //Send to db
        const parkingReservation = await this.commandBus.execute(
            new ReserveParkingCommand(
                invitationID,
                parkingNumber,
                invite.inviteDate,
            ),
        );

        if (parkingReservation) return parkingReservation;
        else throw new ExternalError("Error outside the parking.service");
    }

    /*
    Reserve a specific parking space

    Throws:
    InviteNotFound
    InvalidCommand
    ParkingNotFound

    Returns: parking reserved 

    Status: Done
    */
    async reserveParkingSpace(parkingNumber: number, invitationID: string) {
        //Validate input
        const invite = await this.inviteService.getInvite(invitationID);

        if (!invite)
            throw new InviteNotFound(
                `Invitation with ID ${invitationID} not found`,
            );

        const spaces = await this.getTotalParking();

        if (parkingNumber < 0 || parkingNumber > spaces)
            throw new InvalidCommand(
                `Parking number ${parkingNumber} is out of parking range. Parking range from 0 to ${spaces}`,
            );

        //Additional Checks
        const parking = await this.queryBus.execute(
            new GetParkingQuery(parkingNumber),
        );

        if (parking.enabled == false)
            throw new ParkingNotFound(
                `Parking number ${parkingNumber} is temporarily disabled.`,
            );

        const InviteReservation = await this.queryBus.execute(
            new GetInviteReservationQuery(invitationID),
        );

        if (InviteReservation)
            throw new InvalidCommand(
                `Invitation with ID ${invitationID} already have reserved parking.`,
            );

        const ParkingReservations = await this.queryBus.execute(
            new GetParkingReservationsQuery(parkingNumber),
        );

        //TODO (Kyle) : Is there a more efficient way?
        for (let i = 0; i < ParkingReservations.length; i++) {
            if (ParkingReservations[i].reservationDate === invite.inviteDate)
                throw new InvalidCommand(
                    `Parking number ${parkingNumber} is not available.`,
                );
        }

        //Send to db
        const parkingReservation = await this.commandBus.execute(
            new ReserveParkingCommand(
                invitationID,
                parkingNumber,
                invite.inviteDate,
            ),
        );

        if (parkingReservation) return parkingReservation;
        else
            throw new ParkingNotFound(
                `Parking with Number: ${parkingNumber} not found.`,
            );
    }

    /*
    Unreserve the parking for an invite

    Throws:
    InviteNotFound

    Returns: Nothing

    Status: Done
    */
    async unreserveParking(invitationID: string) {
        //Validate input
        const invite = await this.inviteService.getInvite(invitationID);

        if (!invite)
            throw new InviteNotFound(
                `Invitation with ID ${invitationID} not found.`,
            );

        //Send to db
        await this.commandBus.execute(
            new UnreserveParkingCommand(invitationID),
        );
    }

    /*
    Create n amount of new parking spots

    Throws:
    ExternalError
    InvalidCommand

    Returns: array of parking objects 

    Status: Done
    */
    async createNParkingSpots(N: number) {
        //Validate input
        if (N < 0)
            throw new InvalidCommand(
                `Cannot create ${N} number of parking spots.`,
            );

        //Send to db
        const parking = await this.commandBus.execute(
            new CreateNParkingSpotsCommand(N),
        );

        if (parking) return true;
        else throw new ExternalError("Error outside the parking.service.");
    }

    /*
    Enable a parking spot allowing visitors to use it

    Throws:
    ExternalError
    InvalidCommand

    Returns: enabled parking object

    Status: Done
    */
    async enableParkingSpace(parkingNumber: number) {
        //Validate input
        const spaces = await this.getTotalParking();

        if (parkingNumber < 0 || parkingNumber > spaces)
            throw new InvalidCommand(
                `Parking number ${parkingNumber} is out of parking range. Parking range from 0 to ${spaces}`,
            );

        //Send to db
        const parking = await this.commandBus.execute(
            new EnableParkingSpaceCommand(parkingNumber),
        );

        if (parking) return parking;
        else throw new ExternalError("Error outside the parking.service.");
    }

    /*
    Disable a parking spot allowing visitors to use it

    Throws:
    ExternalError
    InvalidCommand

    Returns: enabled parking object

    Status: Done
    */
    async disableParkingSpace(parkingNumber: number) {
        //Validate input
        const spaces = await this.getTotalParking();

        if (parkingNumber < 0 || parkingNumber > spaces)
            throw new InvalidCommand(
                `Parking number ${parkingNumber} is out of parking range. Parking range from 0 to ${spaces}`,
            );

        //Send to db
        const parking = await this.commandBus.execute(
            new DisableParkingSpaceCommand(parkingNumber),
        );

        if (parking) return parking;
        else throw new ExternalError("Error outside the parking.service.");
    }

    //////////////////////////////////////QUERIES

    /*
    Returns all parking that have not been assigned yet

    Throws:
    ExternalError
    ParkingNotFound

    Returns: array of parking that aren't assigned

    Status: Missing one test case
    */
    async getFreeParking() {
        const parkings = await this.queryBus.execute(new GetFreeParkingQuery());

        if (parkings) {
            if (parkings.length > 0) {
                return parkings;
            } else {
                throw new ParkingNotFound("No Free parkings.");
            }
        } else {
            throw new ExternalError("Error outside the parking.service.");
        }
    }

    /*
    Return all parking reservations made

    Throws:
    ExternalError
    ParkingNotFound

    Returns: an array of parking reservations
    */
    async getReservations() {
        const parkings = await this.queryBus.execute(
            new GetReservationsQuery(),
        );

        if (parkings) {
            if (parkings.length > 0) return parkings;
            else throw new ReservationNotFound("No Reserved parkings");
        } else throw new ExternalError("Error outside the parking.service");
    }

    /*
    Return all reservations of a specific parking space

    Throws:
    ExternalError
    InvalidQuery
    ParkingNotFound

    Returns: an array of reservations for a specific parking space 

    Status: Done except if the parking number should be checked differently?
    */
    async getParkingReservations(
        parkingNumber: number,
        ){
            //Validate input
            const spaces = await this.getTotalParking();

        if (parkingNumber < 0 || parkingNumber > spaces)
            throw new InvalidQuery(
                `Parking number ${parkingNumber} is out of parking range. Parking range from 0 to ${spaces}`,
            );

        const reservations = await this.queryBus.execute(
            new GetParkingReservationsQuery(parkingNumber),
        );

        if (reservations) {
            if (reservations.length > 0) return reservations;
            else
                throw new ParkingNotFound(
                    `No reservations for parking number ${parkingNumber}`,
                );
        } else throw new ExternalError("Error outside the parking.service");
    }

    /*
    Return the reservation of a specific invite

    Throws:
    InviteNotFound
    ParkingNotFound

    Returns: the reservation for a specific invitation

    Status: Done
    */
    async getInviteReservation(invitationID: string) {
        const invite = await this.inviteService.getInvite(invitationID);

        if (!invite)
            throw new InviteNotFound(
                `Invitation with ID ${invitationID} not found.`,
            );

        const reservation = await this.queryBus.execute(
            new GetInviteReservationQuery(invitationID),
        );

        if (reservation) {
            return reservation;
        } else
            throw new ParkingNotFound(
                `No reservations for invitation with ID ${invitationID}`,
            );
    }

    /*
    Get the amount of visitor parking available for use

    Throws: External error
    Returns: amount of available parking

    Note: This does not return unreserved or free parking only spaces regardless their state

    Status: Done
    */
    async getTotalAvailableParking(
        ){
            const amount = this.queryBus.execute(
                new getTotalAvailableParkingQuery()
            )
    
            if(amount)
                return amount;
            else
                throw new ExternalError("Error outside the parking.service");
        }
        async getTotalParking(
            ){
                const amount = this.queryBus.execute(
                    new getTotalParkingQuery()
                )
        
                if(amount)
                    return amount;
                else
                    throw new ExternalError("Error outside the parking.service");
            }
        
    /*
    */
    async getAvailableParking(
        ){
            const parking = this.queryBus.execute(
                new getAvailableParkingQuery()
            )
    
            if(parking)
                return parking;
            else
                throw new ExternalError("Error outside the parking.service");
        }

    async getDisabledParking(
        ){
            const parking = this.queryBus.execute(
                new getDisabledParkingQuery()
            )
    
            if(parking)
                return parking;
            else
                throw new ExternalError("Error outside the parking.service");
        }

  

     /*
    Get the reservations within the range

    Throws:
    External error
    InvalidQuery

    Returns: an array containing the reservations within the given range

    Status: 
    */
    async getParkingReservationInRange(startDate: string, endDate: string) {
        //Validate Input
        const start = Date.parse(startDate);
        const end = Date.parse(endDate);

        if (isNaN(start) || isNaN(end)) {
            throw new InvalidQuery("Given date is not of the form yyyy-mm-dd");
        } else if (start > end) {
            throw new InvalidQuery(
                "Start date can not be later than the end date",
            );
        }

        return this.queryBus.execute(
            new GetReservationsInRangeQuery(startDate, endDate),
        );
    }

    /*
    Get the amounts of parking used within the range per day

    Throws:
    External error
    InvalidQuery

    Returns: an array containing the number of parkings used per day within the range

    Status: Done
    */
    async getUsedParkingInRangeByDate(startDate: string, endDate: string) {
        //Validate Input
        const start = Date.parse(startDate);
        const end = Date.parse(endDate);

        if (isNaN(start) || isNaN(end)) {
            throw new InvalidQuery(
                "Given dates must be of the form yyyy-mm-dd",
            );
        } else if (start > end) {
            throw new InvalidQuery(
                "Start date can not be later than the end date",
            );
        }

        let amounts = [];

        let endD = new Date(endDate);
        let loopD = new Date(startDate);
        let i = 0;
        while (loopD <= endD) {
            let temp = await this.queryBus.execute(
                new GetReservationsByDateQuery(loopD.toDateString()),
            );
            amounts[i] = temp.length;
            loopD = new Date(loopD.setDate(loopD.getDate() + 1));
            i++;
        }

        return amounts;
    }

    async getNumberOfReservations(startDate: string) {
        const start = Date.parse(startDate);

        if (isNaN(start)) {
            throw new InvalidQuery(
                "Given dates must be of the form yyyy-mm-dd",
            );
        }

        return this.queryBus.execute(
            new GetNumberOfReservationsQuery(startDate),
        );
    }

    async isParkingAvailable(startDate?: string) {
        const start = Date.parse(startDate);

        if (isNaN(start)) {
            const now = new Date();
            const year = now.getFullYear();
            let month = "" + (now.getMonth() + 1);
            let day = "" + now.getDate();

            if (month.length < 2) {
                month = "0" + month;
            }

            if (day.length < 2) {
                day = "0" + day;
            }

            startDate = [year, month, day].join("-");
        }

        const numReservationsForDay = await this.queryBus.execute(
            new GetNumberOfReservationsQuery(startDate),
        );

        const numAvailableParkingForDay = await this.queryBus.execute(
            new getTotalAvailableParkingQuery(),
        );

        return numReservationsForDay < numAvailableParkingForDay;
    }
}
