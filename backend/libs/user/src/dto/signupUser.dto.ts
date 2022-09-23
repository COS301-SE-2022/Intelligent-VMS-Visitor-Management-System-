export class SignUpUserDto {
    email: string;
    password: string;
    confirmationPin: string;
    name: string;
    idNumber: string;
    IDDocType: string;
    type: string;
    file: Express.Multer.File;
}
