import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignOutInviteCommand } from '@vms/receptionist/commands/impl';
import { VisitorInviteService } from '@vms/visitor-invite';
import { removeTrayByInviteIDCommand } from '@vms/receptionist/commands/impl/Tray/removeTrayByInviteID.command';
import { ReceptionistService } from '../src/receptionist.service';
import * as FormData from "form-data";
import { HttpService } from '@nestjs/axios';
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

@Injectable()
export class SignOutService {
    FACE_REC_CONNECTION: string;

    constructor(private commandBus: CommandBus,
        private receptionistService: ReceptionistService,
        private httpService: HttpService,
        private configService: ConfigService,
        @Inject(forwardRef(() => {return VisitorInviteService}))
        private inviteService: VisitorInviteService) {
            this.FACE_REC_CONNECTION = this.configService.get<string>("FACE_REC_API_CONNECTION");
    }

    formatDate(date: Date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        } 

        if (day.length < 2) {
            day = '0' + day;
        }

        return [year, month, day].join('-');
    }
    
    async signOut(
        invitationId: string,
    ) {
        const { trayID } = await this.receptionistService.getTrayByInviteID(invitationId);
        await this.commandBus.execute(new SignOutInviteCommand(invitationId, (new Date()).toLocaleString(), trayID));
        return trayID;
    }

    async removeTrayByInviteID(invitationID:string){
        return await this.commandBus.execute(new removeTrayByInviteIDCommand(invitationID));   
    }
    
    async compareFaceFile(invite: any) {
        const { trayID } = await this.receptionistService.getTrayByInviteID(invite.inviteID);
        await this.commandBus.execute(new SignOutInviteCommand(invite.inviteID, (new Date()).toLocaleString(), trayID));
        return {
            "trayNo": trayID,
            "name": invite.visitorName
        };
    }

}
