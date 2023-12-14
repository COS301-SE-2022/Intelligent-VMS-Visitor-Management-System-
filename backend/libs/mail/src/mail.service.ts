import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { toDataURL } from "qrcode";
import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

@Injectable()
export class MailService {
    transporter: Transporter<SMTPTransport.SentMessageInfo>;

    constructor(private configService: ConfigService) {
        this.transporter = createTransport({
            service: "gmail",
            /*  auth: {
                user: this.configService.get<string>("EMAIL"),
                pass: this.configService.get<string>("EMAIL_PASSWORD"),
            }, */
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendInvite(
        to: string,
        from: string,
        inviteID: string,
        idDocType: string,
        reserveParking: boolean,
        inviteDate: string,
    ) {
        // QRCode data to be encoded
        const qrData = JSON.stringify({ inviteID: inviteID });

        // Get the qrcode
        const qrCode = await toDataURL(qrData);

        return this.transporter.sendMail({
            from: '"VMS 👋" <olamidealiyu@gmail.com>', // sender address
            to: to, // list of receivers
            subject: "You received an invite", // Subject line
            attachments: [
                {
                    filename: "image.png",
                    path: qrCode,
                    cid: "olamidealiyu@gmail.com",
                },
            ],
            html: `<h1>Hello Visitor!👋</h1>
                <br />
                <h3>You received an invite from ${from} on ${inviteDate}</h3>
                <br />
                <p>Invite ID: ${inviteID}</p>
                <img src="cid:olamidealiyu@gmail.com" />
                <br/>
                <p>Please present QR-Code to frontdesk, you will be asked to present your chosen form of identification</p>
                ${reserveParking ? "<p>Parking Reserved 🚗</p>" : ""}
                <h4>Please remember to bring your ${idDocType}</h4>
                `,
        });
    }

    async sendVerify(to: string, verficationID: string) {
        return this.transporter.sendMail({
            from: '"VMS 👋" <olamidealiyu@gmail.com>', // sender address
            to: to, // list of receivers
            subject: "Verify Account", // Subject line
            html: `<h1>Hello New User!👋</h1>
                <br />
                <h3>Thank you for choosing V Ʌ S</h3>
                <p>Please verify your account <a href="http://localhost:3000/verify?id=${verficationID}&email=${to}">here</a>.</p>
                `,
            //<p>Please verify your account <a href="https://vms-client.vercel.app/verify?id=${verficationID}&email=${to}">here</a>.</p>
        });
    }

    async sendCancelNotice(
        to: string,
        name: string,
        inviteDate: string,
        userEmail: string,
    ) {
        return this.transporter.sendMail({
            from: '"VMS 👋" <olamidealiyu@gmail.com>', // sender address
            to: to, // list of receivers
            subject: "Invite Cancelled", // Subject line
            html: `
                <h1>Hello ${name}👋</h1>
                <br />
                <h2>🙅Invite Cancel Notice</h2>
                <p>It seems that ${userEmail} has cancelled your visit scheduled for ${inviteDate}.</p>
                `,
        });
    }
}
