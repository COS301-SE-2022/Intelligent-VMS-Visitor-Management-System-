import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { VisitorInviteService } from '@vms/visitor-invite';
import { getTrayFromInviteQuery } from './queries/impl/getTrayFromInvite.query';

@Injectable()
export class ReceptionistService {

    constructor(private commandBus: CommandBus, 
        private queryBus: QueryBus,
        private inviteService: VisitorInviteService) {

        }

    

    async getTrayByInviteID(inviteID:string){
        const tray =  this.queryBus.execute(new getTrayFromInviteQuery(inviteID))
        console.log("getTrayByInviteID");
        return tray;
    }

}
