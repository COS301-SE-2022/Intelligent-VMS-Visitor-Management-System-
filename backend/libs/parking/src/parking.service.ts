import { Injectable } from '@nestjs/common';
import { CommandBus } from "@nestjs/cqrs";
import { Visitor } from "../../visitor/src/schema/visitor.schema";
import { Invite } from "../../visitor-invite/src/schema/invite.schema";
import { ReserveParkingCommand } from './commands/impl/reserveParking.command';
import { StringValueNode } from 'graphql';

@Injectable()
export class ParkingService {
    constructor(private commandBus: CommandBus) {}

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

    async freeParking(parkingNumber: number){
       /* this.commandBus.execute(
            
        )*/
    }

    async assignParking(parkingNumber: number){
        /* this.commandBus.execute(
            
         )*/
     }

    async reserveParking(
        parkingNumber:number,
        invitationID:string
    ){
        this.commandBus.execute( 
            //hard coded 0 for testing
            new ReserveParkingCommand(invitationID,parkingNumber)
        )
    }
}
