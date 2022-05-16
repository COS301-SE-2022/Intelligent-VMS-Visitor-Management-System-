import { Injectable } from '@nestjs/common';

import { toDataURL } from "qrcode";
import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
    transporter: Transporter<SMTPTransport.SentMessageInfo>;

    constructor() {
        this.transporter = createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            secure: false,
            auth: {
                user: "",
                pass: ""
            }
        });
    }

    async sendInvite(to: string, from: string, inviteID: string, reserveParking: boolean) {
        // QRCode data to be encoded
        const qrData = JSON.stringify({ inviteID: inviteID });

        // Get the qrcode
        const qrCode = await toDataURL(qrData);

        return this.transporter.sendMail({
            from: '"VMS 👋" <firestorm19091@gmail.com>', // sender address
            to: to, // list of receivers
            subject: "You received an invite", // Subject line
            html: `<h1>Hello Visitor!👋</h1>
                <br />
                <h3>You received an invite from ${from}</h3>
                <br />
                <p>Invite ID: ${inviteID}</p>
                <img src="${qrCode}"/>
                <br/>
                <p>Please present qrCode to frontdesk, you will be asked to present your chosen form of identification</p>
                ${reserveParking ? "<p>Parking Reserved 🚗</p>" : ""}`,
        });

    } 
}
