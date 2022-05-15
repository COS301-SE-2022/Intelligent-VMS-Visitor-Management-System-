import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AssignParkingCommand } from './commands/impl/assignParking.command';
import { FreeParkingCommand } from './commands/impl/freeParking.command';
import { ReserveParkingCommand } from './commands/impl/reserveParking.command';
import { ParkingNotFound } from "./errors/parkingNotFound.error";
import { getAvailableParkingQuery } from './queries/impl/getAvailableParking.query';

@Injectable()
export class ParkingService {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

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
            return true;
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
            return true;
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
