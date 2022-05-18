import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { randomUUID } from "crypto";

import { toDataURL } from "qrcode";
import { createTransport } from "nodemailer";

import { CreateInviteCommand } from "./commands/impl/createInvite.command";
import { CancelInviteCommand } from "./commands/impl/cancelInvite.command";
import { GetInvitesQuery } from "./queries/impl/getInvites.query";
import { GetInviteQuery } from "./queries/impl/getInvite.query";
import { ParkingService } from '../../../libs/parking/src/parking.service';
import { GetNumberVisitorQuery } from "./queries/impl/getNumberOfVisitors.query";

import { InviteNotFound } from "./errors/inviteNotFound.error";

import { ReserveParkingCommand } from "@vms/parking/commands/impl/reserveParking.command";
import { GetAvailableParkingQuery } from '@vms/parking/queries/impl/getAvailableParking.query';
import { ParkingNotFound } from "@vms/parking/errors/parkingNotFound.error";
import { MailService } from "@vms/mail";

@Injectable()
export class VisitorInviteService {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus, private readonly mailService: MailService) {}

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

        // Parking
        if(requiresParking) {

            const parking =  await this.queryBus.execute(
                new GetAvailableParkingQuery()
            )

            if(parking>0) {
                await this.commandBus.execute(new ReserveParkingCommand(inviteID,2));
            } else {
                throw new ParkingNotFound("Parking Unavailable");
            }
        }

        const info = await this.mailService.sendInvite(visitorEmail, userEmail, inviteID, idDocType, requiresParking);
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
