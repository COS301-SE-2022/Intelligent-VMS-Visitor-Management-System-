import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ConfigService } from "@nestjs/config";

import { getTrayFromInviteQuery } from './queries/impl/getTrayFromInvite.query';
import { Tray } from './models/tray.model'

@Injectable()
export class ReceptionistService {

    constructor(
        private readonly queryBus: QueryBus,
    ) { }

    async getTrayByInviteID(inviteID:string):Promise<Tray>{
        const tray =  this.queryBus.execute(new getTrayFromInviteQuery(inviteID))
        return tray;
    }

}
