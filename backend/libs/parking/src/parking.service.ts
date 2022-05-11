import { Injectable } from '@nestjs/common';
import { CommandBus } from "@nestjs/cqrs";
import { Visitor } from "../../visitor/src/schema/visitor.schema";
import { Invite } from "../../visitor-invite/src/schema/invite.schema";
import { ReserveParkingCommand } from './commands/impl/reserveParking.command';

@Injectable()
export class ParkingService {
    constructor(private commandBus: CommandBus) {}

    async reserveParking(
        reserverEmail: string, 
        reservationDate: Date, 
        parkingNumber: number
    ){
        this.commandBus.execute(
            //TODO (LARISA) user specify specific parking close to his apartment

            //TODO (LARISA) get next avail parking
            
            new ReserveParkingCommand(reserverEmail,reservationDate,parkingNumber)
        );

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

    async createParking(
        parkingNumber:number
    ){
        const d = new Date();
        this.commandBus.execute( 
            new ReserveParkingCommand("larisabotha@gmail.com",d,parkingNumber)
        )
    }
}

