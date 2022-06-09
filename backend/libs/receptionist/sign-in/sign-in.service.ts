import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AssignParkingCommand } from '@vms/parking/commands/impl/assignParking.command';
import { GetInviteReservationQuery } from '@vms/parking/queries/impl/getInviteReservation.query';
import { SignInInviteCommand } from '@vms/receptionist/commands/impl/signInInvite.command';
import { VisitorInviteService } from '@vms/visitor-invite';
import { GetInviteQuery } from '@vms/visitor-invite/queries/impl/getInvite.query';
import { generateTrayCommand } from '../src/commands/impl/Tray/generateTray.command';
import { getTrayListQuery } from '@vms/receptionist/queries/impl/getTrayList.query';
import { ReceptionistService } from '../src/receptionist.service';
import { ParkingService } from '@vms/parking';
import { InviteNotFound } from '../src/errors/inviteNotFound.error';
import { InvalidSignIn } from '../src/errors/invalidSignIn.error';
import { Tray } from '@vms/receptionist/models/tray.model';

@Injectable()
export class SignInService {

    constructor(private commandBus: CommandBus, 
        private queryBus: QueryBus,
        private parkingService: ParkingService,
        private receptionistService: ReceptionistService,
        @Inject(forwardRef(() => VisitorInviteService))
        private inviteService: VisitorInviteService) {}

        async signIn(
            invitationID:string,
            notes: string,
            signInTime: string
        ){
            const invite = await this.inviteService.getInvite(invitationID);
            if(!invite){
                throw new InviteNotFound(`Invitation with ID ${invitationID} not found`);
            } else {
                
                const today = new Date();
                if(new Date(invite.inviteDate).getDate() == today.getDate())
                {
                    await this.commandBus.execute(
                        new SignInInviteCommand(invitationID,notes,signInTime));

                    if(invite.requiresParking)
                    {
                        this.parkingService.assignParking(invitationID);
                    }

                    const tray = await this.generateTray(invitationID,true,true);

                    //const tray = await this.receptionistService.getTrayByInviteID(invitationID);
  
                    return tray.trayID;

                }else{
                    throw new InvalidSignIn(`The date on invitation with ID ${invitationID} does not match the sign in date`)
                }
            }
  
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

        async generateTray(inviteID: string,containsResidentID: boolean,containsVisitorID: boolean):Promise<Tray>{
            console.log("generating tray");
            return this.commandBus.execute(new generateTrayCommand(await this.generateTrayID(),inviteID, containsResidentID,containsVisitorID));
        }
        
        //TODO(Daniel)
        async bulkSignIn(){
            console.log("do some stuff here");
        }



}
