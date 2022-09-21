import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignOutInviteCommand } from '@vms/receptionist/commands/impl';
import { VisitorInviteService } from '@vms/visitor-invite';
import { removeTrayByInviteIDCommand } from '@vms/receptionist/commands/impl/Tray/removeTrayByInviteID.command';
import { ReceptionistService } from '../src/receptionist.service';

@Injectable()
export class SignOutService {

    constructor(private commandBus: CommandBus,
        private queryBus: QueryBus,
        private receptionistService: ReceptionistService,
        @Inject(forwardRef(() => {return VisitorInviteService}))
        private inviteService: VisitorInviteService) { }

    
    async signOut(
        invitationId: string,
    ) {
        const { trayID} = await this.receptionistService.getTrayByInviteID(invitationId);
        await this.commandBus.execute(new SignOutInviteCommand(invitationId, (new Date()).toLocaleString(), trayID));
        return trayID;
    }

    async removeTrayByInviteID(invitationID:string){
        return await this.commandBus.execute(new removeTrayByInviteIDCommand(invitationID));   
    }


}