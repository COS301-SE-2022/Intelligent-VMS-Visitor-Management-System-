import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { randomUUID } from "crypto";

import { toDataURL } from "qrcode";
import { createTransport } from "nodemailer";

import { CreateInviteCommand } from "./commands/impl/createInvite.command";
import { CancelInviteCommand } from "./commands/impl/cancelInvite.command";
import { GetInvitesQuery } from "./queries/impl/getInvites.query";
import { GetInviteQuery } from "./queries/impl/getInvite.query";
import { getAvailableParkingQuery } from '../../../libs/parking/src/queries/impl/getAvailableParking.query';

import { InviteNotFound } from "./errors/inviteNotFound.error";

import { Invite } from "./models/invite.model";
import { ReserveParkingCommand } from "@vms/parking/commands/impl/reserveParking.command";
import { GetNumberVisitorQuery } from "./queries/impl/getNumberOfVisitors.query";

@Injectable()
export class VisitorInviteService {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    async createInvite(
        userEmail: string,
        visitorEmail: string,
        idDocType: string,
        idNumber: string,
        requiresParking: boolean
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

        // Parking
        if(requiresParking)
        {
            //TODO (Larisa) : should I be calling this directly
            const parking =  await this.queryBus.execute(
                new getAvailableParkingQuery()
            )

            if(parking>0)
            {
                //TODO user should be able to reserve parkingSpace close to him
                await this.commandBus.execute(
                    new ReserveParkingCommand(inviteID,2));
            }
            else
            {
                //TODO (Kyle)?
                console.log("error")
            }
        }

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

        // Send mail with defined transport object
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

    async cancelInvite(email: string, inviteID: string) {

        // Get the invite to delete
        const inviteToDelete = await this.queryBus.execute(new GetInviteQuery(inviteID));  

        // Check if it exists
        if(inviteToDelete) {

            // TODO: Might need to change this to allow admin/receptionist to revoke invites
            // Check that the invite belongs to the user that is issuing the request
            if(inviteToDelete.userEmail === email) {
                return await this.commandBus.execute(new CancelInviteCommand(inviteID));
            } else {
                throw new InviteNotFound(`Invite was not issued by: ${email}`);
            }
        } else {
            throw new InviteNotFound(`Invite not found with ID: ${inviteID}`);
        }


    }
    //get the total number of invites that have been sent
    async getTotalNumberOfVisitors() {
        return this.queryBus.execute(new GetNumberVisitorQuery());
    } 
}
