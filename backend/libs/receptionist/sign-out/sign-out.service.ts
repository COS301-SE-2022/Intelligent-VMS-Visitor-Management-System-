import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignOutInviteCommand } from '@vms/receptionist/commands/impl';
import { VisitorInviteService } from '@vms/visitor-invite';
import { removeTrayByInviteIDCommand } from '@vms/receptionist/commands/impl/Tray/removeTrayByInviteID.command';

@Injectable()
export class SignOutService {

    constructor(private commandBus: CommandBus,
        private queryBus: QueryBus,
        @Inject(forwardRef(() => VisitorInviteService))
        private inviteService: VisitorInviteService) { }

    //TODO(Tabitha)
    async signOut(
        invitationId: string,
    ) {
        const trayNumber = await this.removeTrayByInviteID(invitationId);
        await this.commandBus.execute(new SignOutInviteCommand(invitationId, new Date(), trayNumber));
        return trayNumber;
    }

    async removeTrayByInviteID(invitationID:string){
        return await this.commandBus.execute(new removeTrayByInviteIDCommand(invitationID));   
    }


}