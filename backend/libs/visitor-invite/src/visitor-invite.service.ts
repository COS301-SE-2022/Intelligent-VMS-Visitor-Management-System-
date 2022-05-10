import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { randomUUID } from "crypto";

import { toDataURL } from "qrcode";
import { createTransport } from "nodemailer";

import { CreateInviteCommand } from "./commands/impl/createInvite.command";
import { GetInvitesQuery } from "./queries/impl/getInvites.query";

import { Invite } from "./models/invite.model";

@Injectable()
export class VisitorInviteService {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    async createInvite(
        userEmail: string,
        visitorEmail: string,
        idDocType: string,
        idNumber: string,
    ) {
        // Generate inviteID
        const inviteID = randomUUID();

        // Entry in db
        this.commandBus.execute(
            new CreateInviteCommand(
                userEmail,
                visitorEmail,
                idDocType,
                idNumber,
                inviteID,
            ),
        );

        // QRCode data to be encoded
        const qrData = JSON.stringify({ inviteID: inviteID });

        // Get the qrcode
        const qrCode = await toDataURL(qrData);

        // Send email
        const transporter = createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            secure: false, // true for 465(auth ports), false for other ports
            auth: {
                user: "8a3164c958f015",
                pass: "6327e7c4877921",
            },
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"VMS 👋" <firestorm19091@gmail.com>', // sender address
            to: visitorEmail, // list of receivers
            subject: "You received an invite", // Subject line
            html: `<h1>Hello Visitor!</h1><br /><p>Invite ID: ${inviteID}</p><img src="${qrCode}"/>`,
        });

        return info.messageId;
    }

    async getInvites(email: string) {
        return this.queryBus.execute(new GetInvitesQuery(email));
    }
}
