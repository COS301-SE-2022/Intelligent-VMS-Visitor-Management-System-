import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignInInviteCommand } from '@vms/receptionist/commands/impl/signInInvite.command';
import { UserService } from "@vms/user";
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
        private readonly userService: UserService,
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
            const year = d.getFullYear();

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
            invite: any
        ){
            const today = new Date();

            if(!invite){
                return {"error": "Invite not found"};
            } else {
                if(new Date(invite.inviteDate).getDate() == today.getDate()) {
                    await this.commandBus.execute(
                        new SignInInviteCommand(invite.inviteID, invite.notes, today.toLocaleString("en-GB").replace(new RegExp("/", 'g'),"-")));

                    if(invite.requiresParking) {
                        await this.parkingService.assignParking(invite.inviteID);
                    }

                    const tray = await this.generateTray(invite.inviteID,true,true);
                    
                    return {
                        "trayNo": tray.trayID,
                        "name": invite.visitorName,
                        "action": "Signed In"
                    }
                } else {
                    return {"error": "Invite Date does not match"};
                }
            }
        }

        async uploadFaceFile(file: Express.Multer.File, inviteID: string, pin: string, email: string) {
            if(!inviteID) {
                return {
                    "error": "No invite id provided"
                }
            }

            const user = await this.userService.getUserByEmail(email);
            if(user.permission !== 1 && user.pinNumber !== pin) {
                return {
                    "error": "Invalid PIN"
                };
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
                trayNo: await this.signIn(inviteID, "", new Date().toLocaleString("en-GB").replace(new RegExp("/", 'g'),"-")),
                action: "Signed In",
                name: invite.visitorName
            };
        } 


        async compareFaceFile(invite: any) {
            return await this.signInFace(invite);
        }

        async generateTray(inviteID: string,containsResidentID: boolean,containsVisitorID: boolean):Promise<Tray>{
            //console.log("generating tray");
            return this.commandBus.execute(new generateTrayCommand(0, inviteID, containsResidentID, containsVisitorID));
        }
        
        async bulkSignIn(file:string, userEmail:string):Promise<BSIdata>{

           const fileArray =  file.split(/\r\n|\r|\n/);

           let InviteIDIndex;
           let VisitorNameIndex;
           let VisitorEmailIndex;
           let InviteDateIndex;
           let VisitorIDIndex;
           let ResidentEmailIndex;

           const signInCount = 0;
           const createCount = 0;

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
           
           const createData: string[] = [];
           const signInData: string[] = [];
           console.log(fileArray);
           for(let i=1;i<fileArray.length;i++){
            lineArray = fileArray[i].split(";");
            console.log(lineArray);
            if(lineArray[InviteIDIndex]!==""){
                idArray[i-1] = lineArray[InviteIDIndex];
                signInData.push(lineArray[InviteIDIndex]);
            } else{
                    //TODO (Larisa): extend doc types
                    let residentEmail;
                    if(!ResidentEmailIndex)
                        residentEmail = userEmail;
                    else
                        residentEmail = lineArray[ResidentEmailIndex];
                    idArray[i-1] = await this.inviteService.createInviteForBulkSignIn(0,residentEmail,lineArray[VisitorEmailIndex],lineArray[VisitorNameIndex],"RSA-ID",lineArray[VisitorIDIndex],lineArray[InviteDateIndex].replace(new RegExp('/','g'),'-'),false);
                    createData.push(lineArray[VisitorNameIndex]);
                }
           }

            await this.commandBus.execute(new BulkSignInCommand(idArray));

            const bsiData = new BSIdata();
            bsiData.signInData = signInData;
            bsiData.createData = createData;

            return bsiData;
        }
}


    


