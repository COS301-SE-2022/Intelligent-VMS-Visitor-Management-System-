import { Controller, Post, UseInterceptors, UploadedFile, Body, Inject, forwardRef } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from "@nestjs/config";

import { AuthService } from "@vms/auth";

import { SignUpUserDto } from './dto/signupUser.dto';

@Controller('user')
export class UserController {

    constructor(
        @Inject(
            forwardRef(() => {
                return AuthService;
            }),
        )
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {
    }

    @Post("signup")
    @UseInterceptors(FileInterceptor('file'))
    async signupUser(@UploadedFile() file: Express.Multer.File, @Body() body: SignUpUserDto) {
        body.file = file;
        return await this.authService.signup(body);
    } 
}
