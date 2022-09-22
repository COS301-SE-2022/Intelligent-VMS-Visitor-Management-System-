import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { HttpService } from '@nestjs/axios';
import * as FormData from "form-data";

import { Roles } from '@vms/user/decorators/roles.decorator';
import { HttpRolesGuard } from '@vms/user/guards/httpRoles.guard';
import { JwtAuthGuard } from '@vms/auth/guards/JwtAuthGuard.guard';

import { SignInService } from '../sign-in/sign-in.service';
import { SignOutService } from '../sign-out/sign-out.service';
import { VisitorInviteService } from '@vms/visitor-invite';

@Controller('receptionist')
export class ReceptionistController {
    FACE_REC_CONNECTION: string;

    constructor(
        private readonly signInService: SignInService,
        private readonly signOutService: SignOutService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly inviteService: VisitorInviteService
    ) {
        this.FACE_REC_CONNECTION = this.configService.get<string>("FACE_REC_API_CONNECTION");
    }

    @UseGuards(JwtAuthGuard, HttpRolesGuard)
    @Roles("receptionist")
    @Post("/signInAndAddFace")
    @UseInterceptors(FileInterceptor('file'))
    async storeFace(@UploadedFile() file: Express.Multer.File, @Query("inviteID") inviteID: string) {
        return await this.signInService.uploadFaceFile(file, inviteID);
    }

    @UseGuards(JwtAuthGuard, HttpRolesGuard)
    @Roles("receptionist")
    @Post("/compareFace")
    @UseInterceptors(FileInterceptor('file'))
    async compareFace(@UploadedFile() file: Express.Multer.File) {
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
            const invite = await this.inviteService.getInviteForSign(response.data.result.result);

            if(!invite || invite.idNumber !== response.data.result.result) {
                return {
                    "error": "Invite not found"
                };
            }

            if(invite.inviteState === "inActive") {
                return await this.signInService.compareFaceFile(invite);
            } else {
                return await this.signOutService.compareFaceFile(invite);
            }
        }
    
        return response.data;

    }

}
