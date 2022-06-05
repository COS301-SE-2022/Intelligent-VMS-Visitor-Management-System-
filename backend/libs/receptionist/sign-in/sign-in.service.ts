import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignInInviteCommand } from '@vms/receptionist/commands/impl/signInInvite.command';
import { VisitorInviteService } from '@vms/visitor-invite';
import { generateTrayCommand } from '../src/commands/impl/Tray/generateTray.command';

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
        async generateTray(trayID: boolean,inviteID: string,containsResidentID: boolean,containsVisitorID: boolean){
            console.log("generating tray");
            return this.commandBus.execute(new generateTrayCommand(trayID, inviteID, containsResidentID,containsVisitorID));
        }
        

        //TODO(Daniel)
        async bulkSignIn(

        ){
            console.log("do some stuff here");
        }



}
