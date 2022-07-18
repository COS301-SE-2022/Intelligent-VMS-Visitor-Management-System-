import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Cron } from '@nestjs/schedule';
import { randomUUID } from "crypto";

import { CreateInviteCommand } from "./commands/impl/createInvite.command";
import { CancelInviteCommand } from "./commands/impl/cancelInvite.command";
import { GetInvitesQuery } from "./queries/impl/getInvites.query";
import { GetInviteQuery } from "./queries/impl/getInvite.query";
import { GetNumberVisitorQuery } from "./queries/impl/getNumberOfVisitors.query";
import { GetInvitesInRangeQuery } from "./queries/impl/getInvitesInRange.query";
import { GetNumberOfInvitesOfResidentQuery } from "./queries/impl/getNumberOfInvitesOfResident.query";
import { GetInvitesByNameQuery } from "./queries/impl/getInvitesByName.query";
import { GetInvitesInRangeByEmailQuery } from "./queries/impl/getInvitesInRangeByEmail.query";
import { GetTotalNumberOfInvitesVisitorQuery } from "./queries/impl/getTotalNumberOfInvitesVisitor.query";

import { GetInvitesByDateQuery } from "./queries/impl/getInvitesByDate.query";

import { GetInvitesByNameForSearchQuery } from "./queries/impl/getInviteByNameForSearch.query";


import { InviteNotFound } from "./errors/inviteNotFound.error";
import { DateFormatError } from "./errors/dateFormat.error";
import { InviteLimitReachedError } from "./errors/inviteLimitReached.error";

import { ReserveParkingCommand } from "@vms/parking/commands/impl/reserveParking.command";
import { GetAvailableParkingQuery } from '@vms/parking/queries/impl/getAvailableParking.query';
import { ParkingNotFound } from "@vms/parking/errors/parkingNotFound.error";
import { MailService } from "@vms/mail";
import { RestrictionsService } from "@vms/restrictions";
import { ParkingService } from "@vms/parking";

@Injectable()
export class VisitorInviteService {
    constructor(private readonly commandBus: CommandBus, 
                private readonly queryBus: QueryBus, 
                private readonly mailService: MailService,
                private readonly restrictionsService: RestrictionsService,
                @Inject(forwardRef(() => {return ParkingService}))
                private readonly parkingService: ParkingService,
               ) {}

    /*
        Create an invitation for a visitor
    */
    async createInvite(
        permission: number,
        userEmail: string,
        visitorEmail: string,
        visitorName: string,
        idDocType: string,
        idNumber: string,
        inviteDate: string,
        requiresParking: boolean
    ) {

        // If permission level is that of resident check invite limit
        if(permission !== 0 && permission !== 1) {
            const numInvitesAllowed = await this.restrictionsService.getNumInvitesPerResident();
            const numInvitesSent = await this.getTotalNumberOfInvitesOfResident(userEmail);

            if(numInvitesSent >= numInvitesAllowed) {
                throw new InviteLimitReachedError("Max Number of Invites Sent");
            }
        }

        // Generate inviteID
        const inviteID = randomUUID();

        // Entry in db
        await this.commandBus.execute(
            new CreateInviteCommand(
                userEmail,
                visitorEmail,
                visitorName,
                idDocType,
                idNumber,
                inviteDate,
                inviteID,
            ),
        );

        // Parking
        if(requiresParking) {
            await this.parkingService.reserveParking(inviteID);
        }

        const info = await this.mailService.sendInvite(visitorEmail, userEmail, inviteID, idDocType, requiresParking);
        return info.messageId;
    }

    async getInvites(email: string) {
        return this.queryBus.execute(new GetInvitesQuery(email));
    }

    //Get invite by ID
    async getInvite(inviteID: string) {
        return this.queryBus.execute(new GetInviteQuery(inviteID));
    }

    async cancelInvite(email: string, inviteID: string) {

        // Get the invite to delete
        const inviteToDelete = await this.queryBus.execute(new GetInviteQuery(inviteID));  

        // Check if it exists
        if(inviteToDelete) {

            // TODO: Might need to change this to allow admin/receptionist to revoke invites
            // Check that the invite belongs to the user that is issuing the request
            if(inviteToDelete.userEmail === email) {
                await this.parkingService.unreserveParking(inviteID);
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

    // Check if given dates are valid
    _validateDate(startDate: string, endDate: string) {
        const start = Date.parse(startDate);
        const end = Date.parse(endDate);

        if(isNaN(start) || isNaN(end)) {
            throw new DateFormatError("Given Date is not of the form yyyy-mm-dd");
        } else if(start > end) {
            throw new DateFormatError("Start date can not be later than the end date");
        }

        return true;
    }

    // Get invites in date range
    async getNumInvitesPerDate(dateStart: string, dateEnd: string) {
       this._validateDate(dateStart, dateEnd);
       return await this.queryBus.execute(new GetInvitesInRangeQuery(dateStart, dateEnd));
    }

    // Get invites in date range for an user
    async getNumInvitesPerDateOfUser(dateStart: string, dateEnd: string, email: string) {
       this._validateDate(dateStart, dateEnd);
       return await this.queryBus.execute(new GetInvitesInRangeByEmailQuery(dateStart, dateEnd, email));
    }

    // Get Number of total open invites per resident
    async getTotalNumberOfInvitesOfResident(email: string) {
        return await this.queryBus.execute(new GetNumberOfInvitesOfResidentQuery(email)); 
    }

    // Get All Invites regardless of user
    async getInvitesByDate(date: string) {
        return await this.queryBus.execute(new GetInvitesByDateQuery(date)); 
    }
    
    // Get Invite data by visitor name
    async getInvitesByName(name: string) {
        return await this.queryBus.execute(new GetInvitesByNameQuery(name));
    }

    //Searching for receptionist by name
    async getInvitesByNameForSearch(name: string) {
        return await this.queryBus.execute(new GetInvitesByNameForSearchQuery(name));
    }

    //Searching for receptionist by ID
    async getInvitesByIDForReceptionistSearch(inviteID: string) {
        return await this.queryBus.execute(new GetInviteQuery(inviteID));
    }

    // Get total number of invites of the given visitor
    async getTotalNumberOfInvitesVisitor(email: string) {
        return await this.queryBus.execute(new GetTotalNumberOfInvitesVisitorQuery(email));
    }

    @Cron("55 23 * * *")
    async sendInvite() {
        // Generate inviteID
        const inviteID = randomUUID();

        // Get current date & time
        const now = new Date();
        const year = now.getFullYear();
        let month = "" + (now.getMonth() + 1);
        let day = "" + now.getDate();
            
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        } 

        const formatDate = [year, month, day].join('-');

        // Entry in db
        await this.commandBus.execute(
            new CreateInviteCommand(
                "admin@mail.com",
                "visitor@mail.com",
                "Jim",
                "RSA-ID",
                "0109195283010",
                formatDate,
                inviteID,
            ),
        );

        await this.parkingService.reserveParking(inviteID);

    }

}
