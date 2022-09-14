import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Roles } from '@vms/user/decorators/roles.decorator';
import { HttpRolesGuard } from '@vms/user/guards/httpRoles.guard';
import { JwtAuthGuard } from '@vms/auth/guards/JwtAuthGuard.guard';

import { ReceptionistService } from './receptionist.service';

@Controller('receptionist')
export class ReceptionistController {
    constructor(
        private readonly receptionistService: ReceptionistService,
    ) {}

    @UseGuards(JwtAuthGuard, HttpRolesGuard)
    @Roles("receptionist")
    @Post("/storeFace")
    @UseInterceptors(FileInterceptor('file'))
    async storeFace(@UploadedFile() file: Express.Multer.File, @Query("idNumber") idNumber: string, @Query("name") name: string) {
        console.log(idNumber);
        return await this.receptionistService.uploadFaceFile(file, idNumber, name);
    }

    @UseGuards(JwtAuthGuard, HttpRolesGuard)
    @Roles("receptionist")
    @Post("/compareFace")
    @UseInterceptors(FileInterceptor('file'))
    async compareFace(@UploadedFile() file: Express.Multer.File, @Query("idNumber") idNumber: string) {
        return await this.receptionistService.compareFaceFile(file, idNumber);
    }
}
