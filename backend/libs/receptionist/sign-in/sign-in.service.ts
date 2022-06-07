import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AssignParkingCommand } from '@vms/parking/commands/impl/assignParking.command';
import { GetInviteReservationQuery } from '@vms/parking/queries/impl/getInviteReservation.query';
import { SignInInviteCommand } from '@vms/receptionist/commands/impl/signInInvite.command';
import { VisitorInviteService } from '@vms/visitor-invite';
import { GetInviteQuery } from '@vms/visitor-invite/queries/impl/getInvite.query';

@Injectable()
export class SignInService {

    constructor(private commandBus: CommandBus, 
        private queryBus: QueryBus,
        @Inject(forwardRef(() => VisitorInviteService))
        private inviteService: VisitorInviteService) {}

        //TODO(Larisa)
        async signIn(
            invitationID:string,
            notes: string
        ){
            const invite = await this.queryBus.execute(new GetInviteQuery(invitationID));
            if(invite.requiresParking)
            {
                const reservation = await this.queryBus.execute(new GetInviteReservationQuery(invitationID))
                await this.commandBus.execute(
                    new AssignParkingCommand(invite.visitorEmail,reservation.parkingNumber));
            }

            return await this.commandBus.execute(
                new SignInInviteCommand(invitationID,notes));

            
        }

        //TODO(Daniel)
        async generateTrayNumber(

        ){
            console.log("do some stuff here");
        }

        //TODO(Daniel)
        async bulkSignIn(

        ){
            console.log("do some stuff here");
        }



}
