import { Injectable } from '@nestjs/common';
import { QueryBus, CommandBus } from "@nestjs/cqrs";

import { SetNumInvitesCommand } from "./commands/impl/setNumInvites.command";
import { GetNumInvitesQuery } from './queries/impl/getNumInvites.query';
import { SetCurfewTimeCommand } from "./commands/impl/setCurfewTime.command";
import { GetCurfewTimeQuery } from './queries/impl/getCurfewTime.query';

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

    // Set the number of invites a resident may have sent/open at once
    async setCurfewTime(curfewTime: number) {
        return this.commandBus.execute(new SetCurfewTimeCommand(curfewTime));
    }

    // Set the number of invites a resident may have sent/open at once
    async getCurfewTime() {
        return await this.queryBus.execute(new GetCurfewTimeQuery());
    }
}
