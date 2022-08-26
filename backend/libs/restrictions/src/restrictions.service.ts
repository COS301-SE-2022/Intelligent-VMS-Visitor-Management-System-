import { Injectable } from '@nestjs/common';
import { QueryBus, CommandBus } from "@nestjs/cqrs";

import { SetNumInvitesCommand } from "./commands/impl/setNumInvites.command";
import { GetNumInvitesQuery } from './queries/impl/getNumInvites.query';
import { SetCurfewTimeCommand } from "./commands/impl/setCurfewTime.command";
import { GetCurfewTimeQuery } from './queries/impl/getCurfewTime.query';
import { Cron, CronExpression } from '@nestjs/schedule';

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

    // Set the curfew
    async setCurfewTime(curfewTime: number) {
        return this.commandBus.execute(new SetCurfewTimeCommand(curfewTime));
    }

    // Get the curfew
    async getCurfewTime() {
        return await this.queryBus.execute(new GetCurfewTimeQuery());
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async extendCurfews() {
        // fetch curfew
        const curfew = await this.getCurfewTime(); // this is where we will get the time when this method is fully implemented
        console.log('curfew is: ', curfew); // here we are just checking what is in the db 

        const _curfewTime = '2022-08-25T20:21:25.034Z'; // this should be the value we receive above 
        const _signInDate = '2022-08-25T20:21:25.034Z'; // date person signed in regardless of curfew
        const curfewDate: any = new Date(_curfewTime);
        const signInDate: any = new Date(_signInDate);
        const now: any = new Date();
        console.log('time: ', now)

        const signInDiffTime = Math.abs((now - signInDate));
        const signInDiffHours = Math.ceil(signInDiffTime / (1000 * 60 * 60)) - 1;
        const signInDiffDays = Math.ceil(signInDiffTime / (1000 * 60 * 60 * 24)) - 1;

        const curfewDiffTime = Math.abs((now - curfewDate));
        const curfewDiffHours = Math.ceil(curfewDiffTime / (1000 * 60 * 60)) - 1;
        const curfewDiffDays = Math.ceil(curfewDiffTime / (1000 * 60 * 60 * 24)) - 1;

        if (signInDiffDays >= 3) {
            return;  // we don't extend curfew beyond 3 days 
        }

        if (curfewDiffTime >= 24) {
            await this.setCurfewTime(24); // add 24 hours to the curfew
        }

        console.log(curfewDiffHours + " hours");
        console.log(curfewDiffDays + " days");
    }

   
}
