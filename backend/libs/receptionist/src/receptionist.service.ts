import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { VisitorInviteService } from '@vms/visitor-invite';

@Injectable()
export class ReceptionistService {

    constructor(private commandBus: CommandBus, 
        private queryBus: QueryBus,
        @Inject(forwardRef(() => VisitorInviteService))
        private inviteService: VisitorInviteService) {

        }

    //TODO (Stefan)
    async getInviteByName(){

    }

    //TODO(Sefan)
    async getInviteByID(){
        
    }
}
