import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { HttpService } from '@nestjs/axios';
import * as FormData from "form-data";

import { getTrayFromInviteQuery } from './queries/impl/getTrayFromInvite.query';
import { Tray } from './models/tray.model'
import { SignInService } from '../sign-in/sign-in.service';

@Injectable()
export class ReceptionistService {
    FACE_REC_CONNECTION: string;

    constructor(
        private readonly queryBus: QueryBus,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.FACE_REC_CONNECTION = this.configService.get<string>("FACE_REC_API_CONNECTION");
    }

    async getTrayByInviteID(inviteID:string):Promise<Tray>{
        const tray =  this.queryBus.execute(new getTrayFromInviteQuery(inviteID))
        return tray;
    }

    async uploadFaceFile(file: Express.Multer.File, idNumber: string, name: string) {
        if(!idNumber) {
            return {
                "error": "No id-number provided"
            }
        } 

        if(!name) {
            return {
                "error": "No name provided"
            }
        }

        const formData = new FormData();
        formData.append('file', file.buffer, { filename: file.originalname });

        const response = await firstValueFrom(
            this.httpService.post(
                `${this.FACE_REC_CONNECTION}/storeFace?idNumber=${idNumber}&name=${name}`,
                formData,
                { headers: formData.getHeaders() }
            )
        );
        
        if(response.data.result) {
        } else {
        }

        return response.data;
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
        }

        return response.data;
    }

}
