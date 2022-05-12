import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AssignParkingCommand } from './commands/impl/assignParking.command';
import { FreeParkingCommand } from './commands/impl/freeParking.command';
import { ReserveParkingCommand } from './commands/impl/reserveParking.command';
import { ParkingNotFound } from "./errors/parkingNotFound.error";
import {Parking} from "../src/schema/parking.schema"
import { getAvailableParkingQuery } from './queries/impl/getAvailableParking.query';

@Injectable()
export class ParkingService {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    async createParking(
        reserverEmail: string, 
        reservationDate: Date, 
        parkingNumber: number
    ){
        /*this.commandBus.execute(
            //TODO (LARISA) user specify specific parking close to his apartment?

            //TODO (LARISA) get next avail parking
            
            //hard coded 0 for testing
            //new ReserveParkingCommand("0",parkingNumber)
        );*/

        return "here";
    }

    async getAvailableParking(){
        return this.queryBus.execute(
            new getAvailableParkingQuery()
        )
    }

    async freeParking(
        parkingNumber: number
    ){
        const parking =  this.commandBus.execute(
            new FreeParkingCommand(parkingNumber)
        )

        if(parking) {
            return "true";
            //return parking;
        } else {
            throw new ParkingNotFound(`Parking with Number: ${parkingNumber} not found`);
        }
    }

    async assignParking(
        visitorEmail: string,
        parkingNumber: number
    ){
    
        const parking = this.commandBus.execute(
            new AssignParkingCommand(visitorEmail,parkingNumber)
         )

        if(parking){
            return "true";
            //return parking.reservationInvitationID;
        } else {
            throw new ParkingNotFound(`Parking with Number: ${parkingNumber} not found`);
        }
     }

    async reserveParking(
        parkingNumber:number,
        invitationID:string
    ){
        const parking = await this.commandBus.execute(
            new ReserveParkingCommand(invitationID,parkingNumber));
        
        if(parking) {
                return parking.reservationInviteID;
            } else {
                throw new ParkingNotFound(`Parking with Number: ${parkingNumber} not found`);
            }
    }
}
