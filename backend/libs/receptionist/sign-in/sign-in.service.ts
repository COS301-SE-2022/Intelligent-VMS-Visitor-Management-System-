import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignInInviteCommand } from '@vms/receptionist/commands/impl/signInInvite.command';
import { VisitorInviteService } from '@vms/visitor-invite';
import { generateTrayCommand } from '../src/commands/impl/Tray/generateTray.command';
import { getTrayListQuery } from '@vms/receptionist/queries/impl/getTrayList.query';

@Injectable()
export class SignInService {

    constructor(private commandBus: CommandBus, 
        private queryBus: QueryBus,
        @Inject(forwardRef(() => {return VisitorInviteService}))
        private inviteService: VisitorInviteService) {}

        //TODO(Larisa)
        async signIn(
            invitationID:string,
            notes: string
        ){
            this.generateTray(invitationID,true,true);
            return await this.commandBus.execute(
                new SignInInviteCommand(invitationID,notes));
        }

        async generateTrayID(){
            const trayList = await this.queryBus.execute(
                new getTrayListQuery()
            )
            
            if (trayList) {
                for (let index = 0; index < trayList.length; index++) {
                    if (trayList[index].trayID!=index) {
                        return index;
                        //say we have 2 trays and tray[0] has id 0 and tray[1] has id 2 then
                        //next tray should have id 1
                    }
                }
                return trayList.length; 
                //if it reaches this point and we have say 4 trays it means their id's are
                //0,1,2,3 and so next tray number should be 4   
            }
            else{
               return 0;
            }
        }

        async generateTray(inviteID: string,containsResidentID: boolean,containsVisitorID: boolean){
            console.log("generating tray");
            return this.commandBus.execute(new generateTrayCommand(await this.generateTrayID(),inviteID, containsResidentID,containsVisitorID));
        }
        
        //TODO(Daniel)
        async bulkSignIn(){
            console.log("do some stuff here");
        }



}
