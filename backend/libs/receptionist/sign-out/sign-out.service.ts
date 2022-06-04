import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignOutInviteCommand } from '@vms/receptionist/commands/impl';
import { VisitorInviteService } from '@vms/visitor-invite';

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
        return await this.commandBus.execute(new SignOutInviteCommand(invitationId, new Date()));
    }

    //TODO(Daniel)
    async getTrayNumber(

    ) {
        console.log("do some stuff here");
    }


}