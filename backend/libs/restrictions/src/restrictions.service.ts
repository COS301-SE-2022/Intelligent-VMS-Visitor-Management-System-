import { Injectable } from '@nestjs/common';
import { QueryBus, CommandBus } from "@nestjs/cqrs";

import { SetNumInvitesCommand } from "./commands/impl/setNumInvites.command";
import { GetNumInvitesQuery } from './queries/impl/getNumInvites.query';

@Injectable()
export class RestrictionsService {
    constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

    // Set the number of invites a resident may have sent/open at once
    async setNumInvitesPerResident(numInvites: number) {
        return this.commandBus.execute(new SetNumInvitesCommand(numInvites));
    }

    // Set the number of invites a resident may have sent/open at once
    async getNumInvitesPerResident() {
        return await this.queryBus.execute(new GetNumInvitesQuery());
    }
}
