import { UseGuards, Inject, forwardRef } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "@vms/auth";
import { GqlAuthGuard } from "@vms/auth/guards/GqlAuthGuard.guard";

import { VisitorInviteService } from "./visitor-invite.service";

import { Invite } from "./models/invite.model";
import { SearchInvite } from "./models/searchInvite.model";

import { User } from "@vms/user/models/user.model";

import { CurrentUser } from "@vms/auth/decorators/CurrentUserDecorator.decorator";
import { RolesGuard } from "@vms/user/guards/roles.guard";
import { Roles } from "@vms/user/decorators/roles.decorator";

//@UseGuards(GqlAuthGuard)
@Resolver((of) => Invite)
export class VisitorInviteResolver {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
        private visitorInviteService: VisitorInviteService,
    ) {}

    // Test endpoint
    @Query((returns) => String, { name: "helloInvite" })
    async hello() {
        return "👋 from Invite";
    }

    // Returns the invites issued by the current user
    @Query((returns) => [Invite], { name: "getInvites"})
    async getInvites(@CurrentUser() user: User) {
        return this.visitorInviteService.getInvites(user.email);
    }

    // Create Invite
    @Mutation((returns) => String, { name: "createInvite" })
    async createInvite(
        @Args("userEmail") userEmail: string,
        @Args("visitorName") visitorName: string,
        @Args("visitorEmail") email: string,
        @Args("IDDocType") idDocType: string,
        @Args("IDNumber") idNumber: string,
        @Args("inviteDate") inviteDate: string,
        @Args("requiresParking") requiresParking: boolean,
    ) {
        return this.visitorInviteService.createInvite(
            userEmail,
            email,
            visitorName,
            idDocType,
            idNumber,
            inviteDate,
            requiresParking
        );
    }

    // Cancel Invite with inviteID
    @Mutation((returns) => Boolean, { name: "cancelInvite" })
    async cancelInvite(@CurrentUser() user: User, @Args("inviteID") inviteID: string) {
        const res = await this.visitorInviteService.cancelInvite(user.email, inviteID);
        return res.acknowledged;
    }

    //Get total number of invites in the database
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Query((returns) => Number, { name: "getTotalNumberOfVisitors" })
    async getTotalNumberOfVisitors() {
        return this.visitorInviteService.getTotalNumberOfVisitors()
    }

    // Get Number of invites in date range
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Query((returns) => [Invite], { name: "getNumInvitesPerDate"})
    async getNumInvitesPerDate(@Args("dateStart") dateStart: string, @Args("dateEnd") dateEnd: string) {
        return this.visitorInviteService.getNumInvitesPerDate(dateStart, dateEnd);
    }

    // Get Number of invites in date range
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin", "resident", "receptionist")
    @Query((returns) => [Invite], { name: "getNumInvitesPerDateOfUser"})
    async getNumInvitesPerDateOfUser(@Args("dateStart") dateStart: string, @Args("dateEnd") dateEnd: string, @Args("email") email: string) {
        return this.visitorInviteService.getNumInvitesPerDateOfUser(dateStart, dateEnd, email);
    }

    // Get Number of total open invites per resident
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("resident", "receptionist", "admin")
    @Query((returns) => Number, { name: "getTotalNumberOfInvitesOfResident"})
    async getTotalNumberOfVisitorsOfResident(@Args("email") email: string) {
        return this.visitorInviteService.getTotalNumberOfInvitesOfResident(email);
    }

    // Get the invites associated with given name
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Query((returns) => [SearchInvite], { name: "getInvitesByName"})
    async getInvitesByName(@Args("name") name: string) {
        return await this.visitorInviteService.getInvitesByName(name);
    }

    // Get the invites associated with given name for receptionist search
    //@UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("receptionist")
    @Query((returns) => [Invite], { name: "getInvitesByNameForReceptionist"})
    async getInvitesByNameForReceptionistSearch(@Args("name") name: string) {
        return await this.visitorInviteService.getInvitesByNameForSearch(name);
    }

    // Get the invites associated with given ID for receptionist search
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("receptionist")
    @Query((returns) => Invite, { name: "getInvitesByIDForReceptionist"})
    async getInvitesByIDForReceptionistSearch(@Args("inviteID") inviteID: string) {
        return await this.visitorInviteService.getInvite(inviteID);
    }


    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Query((returns) => Number, { name: "getNumberOfInvitesOfVisitor"})
    async getNumberOfInvitesOfVisitor(@Args("email") email: string) {
        return await this.visitorInviteService.getTotalNumberOfInvitesVisitor(email);
    }

     //Get all invites in the database
     @UseGuards(GqlAuthGuard, RolesGuard)
     @Roles("receptionist", "admin")
     @Query((returns) => [Invite], { name: "getInvitesByDate" })
     async getAllInvites(@Args("date") date: string) {
         return this.visitorInviteService.getInvitesByDate(date)
     }

}

