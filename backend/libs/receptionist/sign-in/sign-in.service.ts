import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignInInviteCommand } from '@vms/receptionist/commands/impl/signInInvite.command';
import { VisitorInviteService } from '@vms/visitor-invite';

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
