import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Roles } from '@vms/user/decorators/roles.decorator';
import { HttpRolesGuard } from '@vms/user/guards/httpRoles.guard';
import { JwtAuthGuard } from '@vms/auth/guards/JwtAuthGuard.guard';

import { ReceptionistService } from './receptionist.service';
import { SignInService } from '../sign-in/sign-in.service';

@Controller('receptionist')
export class ReceptionistController {
    constructor(
        private readonly receptionistService: ReceptionistService,
        private readonly signInService: SignInService
    ) {}

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
    async compareFace(@UploadedFile() file: Express.Multer.File, @Query("idNumber") idNumber: string) {
        return await this.signInService.compareFaceFile(file, idNumber);
    }
}