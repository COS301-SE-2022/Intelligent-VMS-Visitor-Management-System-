import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { VisitorInviteService } from '@vms/visitor-invite';
import { getTrayFromInviteQuery } from './queries/impl/getTrayFromInvite.query';
import {Tray} from './models/tray.model'

@Injectable()
export class ReceptionistService {

    constructor(
        private commandBus: CommandBus, 
        private queryBus: QueryBus,
        private inviteService: VisitorInviteService) {

        }

    

    async getTrayByInviteID(inviteID:string):Promise<Tray>{
        const tray =  this.queryBus.execute(new getTrayFromInviteQuery(inviteID))
        console.log("getTrayByInviteID");
        return tray;
    }

}
