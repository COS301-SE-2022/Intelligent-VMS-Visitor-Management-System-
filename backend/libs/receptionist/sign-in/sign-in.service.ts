import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignInInviteCommand } from '@vms/receptionist/commands/impl/signInInvite.command';
import { VisitorInviteService } from '@vms/visitor-invite';
import { generateTrayCommand } from '../src/commands/impl/Tray/generateTray.command';
import { getTrayListQuery } from '@vms/receptionist/queries/impl/getTrayList.query';
import { ReceptionistService } from '../src/receptionist.service';
import { ParkingService } from '@vms/parking';
import { InviteNotFound } from '../src/errors/inviteNotFound.error';
import { InvalidSignIn } from '../src/errors/invalidSignIn.error';
import { Tray } from '@vms/receptionist/models/tray.model';
import { BulkSignInCommand } from '@vms/receptionist/commands/impl/bulkSignIn.command';
import { BSIdata } from '@vms/receptionist/models/BSIdata.model';
import * as FormData from "form-data";
import { HttpService } from '@nestjs/axios';
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

@Injectable()
export class SignInService {
    FACE_REC_CONNECTION: string;

    constructor(private commandBus: CommandBus, 
        private queryBus: QueryBus,
        private parkingService: ParkingService,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private receptionistService: ReceptionistService,
        @Inject(forwardRef(() => {return VisitorInviteService}))
        private inviteService: VisitorInviteService) {
            this.FACE_REC_CONNECTION = this.configService.get<string>("FACE_REC_API_CONNECTION");
        }

        formatDate(date: Date) {
            const d = new Date(date);
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            let year = d.getFullYear();

            if (month.length < 2) {
                month = '0' + month;
            } 

            if (day.length < 2) {
                day = '0' + day;
            }

            return [year, month, day].join('-');
        }

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
                if(new Date(invite.inviteDate).getDate() == today.getDate()) {
                    await this.commandBus.execute(
                        new SignInInviteCommand(invitationID,notes,signInTime));

                    if(invite.requiresParking) {
                        await this.parkingService.assignParking(invitationID);
                    }

                    const tray = await this.generateTray(invitationID,true,true);
  
                    return tray.trayID;
                } else {
                    throw new InvalidSignIn(`The date on invitation with ID ${invitationID} does not match the sign in date`)
                }
            }
        }

        async signInFace(
            idNumber: string,
        ){
            const today = new Date();
            const invite = await this.inviteService.getInviteForSignInData(idNumber, this.formatDate(today));

            if(!invite){
                return {"error": "Invite not found"};
            } else {
                if(new Date(invite.inviteDate).getDate() == today.getDate()) {
                    await this.commandBus.execute(
                        new SignInInviteCommand(invite.inviteID, invite.notes, today.toLocaleTimeString()));

                    if(invite.requiresParking) {
                        await this.parkingService.assignParking(invite.inviteID);
                    }

                    const tray = await this.generateTray(invite.inviteID,true,true);
                    
                    return {
                        "trayNo": tray.trayID,
                        "name": invite.visitorName,
                    }
                } else {
                    return {"error": "Invite Date does not match"};
                }
            }
        }

        async uploadFaceFile(file: Express.Multer.File, inviteID: string) {
            console.log(inviteID);
            if(!inviteID) {
                return {
                    "error": "No invite id provided"
                }
            }

            const invite = await this.inviteService.getInvite(inviteID);

            if(!invite) {
                return {"error": "Invite not found"};
            } else if (invite.inviteState === "signedIn" || invite.inviteState === "signedOut") {
                return {"error": "Invite already used"};
            } 

            const formData = new FormData();
            formData.append('file', file.buffer, { filename: file.originalname });

            const response = await firstValueFrom(
                this.httpService.post(
                    `${this.FACE_REC_CONNECTION}/storeFace?idNumber=${invite.idNumber}&name=${invite.visitorName}`,
                    formData,
                    { headers: formData.getHeaders() }
                )
            );
        
            return {
                trayNo: await this.signIn(inviteID, "", new Date().toLocaleTimeString()),
                name: invite.visitorName
            };
        } 


        async compareFaceFile(file: Express.Multer.File, idNumber: string) {
            if(!idNumber) {
                return {
                    "error": "No id-number provided"
                }
            }

            const formData = new FormData();
            formData.append('file', file.buffer, { filename: file.originalname });
        
            const response = await firstValueFrom(
                this.httpService.post(
                    `${this.FACE_REC_CONNECTION}/compareFaces`,
                    formData,
                    { headers: formData.getHeaders() }
                )
            );

            if(response.data && response.data.result) {
                return await this.signInFace(idNumber);
            } 

            return response.data;
        }


        async generateTray(inviteID: string,containsResidentID: boolean,containsVisitorID: boolean):Promise<Tray>{
            //console.log("generating tray");
            return this.commandBus.execute(new generateTrayCommand(await 0, inviteID, containsResidentID, containsVisitorID));
        }
        
        async bulkSignIn(file:string, userEmail:string):Promise<BSIdata>{

           const fileArray =  file.split(/\r\n|\r|\n/);

           let InviteIDIndex;
           let VisitorNameIndex;
           let VisitorEmailIndex;
           let InviteDateIndex;
           let VisitorIDIndex;
           let ResidentEmailIndex;

           let signInCount = 0;
           let createCount = 0;

           const idArray = [];
           let lineArray = fileArray[0].split(";");
           for(let i=0;i<lineArray.length;i++){
            
            if(lineArray[i].toLocaleLowerCase().includes("email")) {
                if(lineArray[i].toLocaleLowerCase().includes("user") || lineArray[i].toLocaleLowerCase().includes("resident"))
                    ResidentEmailIndex = i;
                else
                    VisitorEmailIndex = i;
            }else if(lineArray[i].toLocaleLowerCase().includes("name"))
                VisitorNameIndex = i;
            else if(lineArray[i].toLocaleLowerCase().includes("date"))
                InviteDateIndex = i;
            else if(lineArray[i].toLocaleLowerCase().includes("id")){
                if(lineArray[i].toLocaleLowerCase().includes("invite"))
                    InviteIDIndex = i;
                else
                    VisitorIDIndex = i;
            }
           }
           
           console.log(fileArray);
           for(let i=0;i<fileArray.length-1;i++){
            lineArray = fileArray[i].split(";");
            if(lineArray[InviteIDIndex]!==""){
                idArray[i-1] = lineArray[InviteIDIndex];
                signInCount++;
            } else{
                    //TODO (Larisa): extend doc types
                    let residentEmail;
                    if(!ResidentEmailIndex)
                        residentEmail = userEmail;
                    else
                        residentEmail = lineArray[ResidentEmailIndex];
                    idArray[i-1] = await this.inviteService.createInviteForBulkSignIn(0,residentEmail,lineArray[VisitorEmailIndex],lineArray[VisitorNameIndex],"RSA-ID",lineArray[VisitorIDIndex],lineArray[InviteDateIndex].replace(new RegExp('/','g'),'-'),false);
                    createCount++;
                }
           }

            await this.commandBus.execute(new BulkSignInCommand(idArray));

            const bsiData = new BSIdata();
            bsiData.createCount = createCount;
            bsiData.signInCount = signInCount;

            return bsiData;
        }
}


    


