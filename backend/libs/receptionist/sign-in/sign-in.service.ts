import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { VisitorInviteService } from '@vms/visitor-invite';

@Injectable()
export class SignInService {

    constructor(private commandBus: CommandBus, 
        private queryBus: QueryBus,
        @Inject(forwardRef(() => VisitorInviteService))
        private inviteService: VisitorInviteService) {}

        //TODO(Larisa)
        async signIn(
            invitationID:String,
            notes: String
        ){

        }

        //TODO(Daniel)
        async generateTrayNumber(

        ){

        }

        //TODO(Daniel)
        async bulkSignIn(

        ){

        }



}
