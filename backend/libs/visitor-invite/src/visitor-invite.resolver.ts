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
import { PredictedInviteData } from "./models/predictedInviteData.model";
import { Visitor } from "./models/visitor.model";
import { InviteSuggestion } from "./models/inviteSuggestion.model";
import { GroupInvite } from "./models/groupInvite.model";

//@UseGuards(GqlAuthGuard)
@Resolver((of) => {return Invite})
export class VisitorInviteResolver {
    constructor(
        @Inject(forwardRef(() => {return AuthService}))
        private authService: AuthService,
        private visitorInviteService: VisitorInviteService,
    ) {}

    // Test endpoint
    @Query((returns) => {return String}, { name: "helloInvite" })
    async hello() {
        return "👋 from Invite";
    }

    // Returns the invites issued by the current user
    @Query((returns) => {return [Invite]}, { name: "getInvites"})
    async getInvites(@CurrentUser() user: User) {
        return this.visitorInviteService.getInvites(user.email);
    }
    
    @Query((returns) => {return [Invite]}, { name: "getInvitesWithEmail"})
    async getInvitesWithEmail(@Args("email") email: string) {
        return this.visitorInviteService.getInvites(email);
    }

    // Create Invite
    @Mutation((returns) => {return String}, { name: "createInvite" })
    async createInvite(
        @CurrentUser() user: User,
        @Args("userEmail") userEmail: string,
        @Args("visitorName") visitorName: string,
        @Args("visitorEmail") email: string,
        @Args("IDDocType") idDocType: string,
        @Args("IDNumber") idNumber: string,
        @Args("inviteDate") inviteDate: string,
        @Args("requiresParking") requiresParking: boolean,
    ) {
        return this.visitorInviteService.createInvite(
            user.permission,
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
    @Mutation((returns) => {return Boolean}, { name: "cancelInvite" })
    async cancelInvite(@CurrentUser() user: User, @Args("inviteID") inviteID: string) {
        const res = await this.visitorInviteService.cancelInvite(user.email, inviteID);
        return res.acknowledged;
    }

    //Get total number of invites in the database
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Query((returns) => {return Number}, { name: "getTotalNumberOfVisitors" })
    async getTotalNumberOfVisitors() {
        return this.visitorInviteService.getTotalNumberOfVisitors()
    }

    // Get Number of invites in date range
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Query((returns) => {return [Invite]}, { name: "getNumInvitesPerDate"})
    async getNumInvitesPerDate(@Args("dateStart") dateStart: string, @Args("dateEnd") dateEnd: string) {
        return this.visitorInviteService.getNumInvitesPerDate(dateStart, dateEnd);
    }

    // Get Number of invites in date range
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin", "resident", "receptionist")
    @Query((returns) => {return [Invite]}, { name: "getNumInvitesPerDateOfUser"})
    async getNumInvitesPerDateOfUser(@Args("dateStart") dateStart: string, @Args("dateEnd") dateEnd: string, @Args("email") email: string) {
        return this.visitorInviteService.getNumInvitesPerDateOfUser(dateStart, dateEnd, email);
    }

    // Get Number of total open invites per resident
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("resident", "receptionist", "admin")
    @Query((returns) => {return Number}, { name: "getTotalNumberOfInvitesOfResident"})
    async getTotalNumberOfVisitorsOfResident(@Args("email") email: string) {
        return this.visitorInviteService.getTotalNumberOfInvitesOfResident(email);
    }

    // Get the invites associated with given name
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Query((returns) => {return [SearchInvite]}, { name: "getInvitesByName"})
    async getInvitesByName(@Args("name") name: string) {
        return await this.visitorInviteService.getInvitesByName(name);
    }

    // Get the invites associated with given name for receptionist search
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("receptionist")
    @Query((returns) => [Invite], { name: "getInvitesByNameForSearch"})
    async getInvitesByNameForReceptionistSearch(@Args("name") name: string) {
        return await this.visitorInviteService.getInvitesByNameForSearch(name);
    }

    // Get the invites associated with given ID for receptionist search
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("receptionist")
    @Query((returns) => Invite, { name: "getInvitesByIDForSearch"})
    async getInvitesByIDForReceptionistSearch(@Args("inviteID") inviteID: string) {
        return await this.visitorInviteService.getInvite(inviteID);
    }


    // Get number of invites given a user by email
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Query((returns) => {return Number}, { name: "getNumberOfInvitesOfVisitor"})
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

    // Get number of open invites for given user by email
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("receptionist", "admin", "resident")
    @Query((returns) => {return Number}, { name: "getNumberOfOpenInvites"})
    async getNumberOfOpenInvites(@Args("email") email: string) {
        return await this.visitorInviteService.getNumberOfOpenInvites(email);
    }

    // Get Predicted number of visitors
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Query((returns) => {return [PredictedInviteData]})
    async getPredictedInviteData(@Args("startDate") startDate: string, @Args("endDate") endDate: string) {
        return await this.visitorInviteService.getPredictedInviteData(startDate, endDate);
    }

    // Get Visitors for user
    @UseGuards(GqlAuthGuard)
    @Query((returns) => {return [Visitor]}, { name: "getVisitors" })
    async getVisitors(@Args("email") email: string) {
        return await this.visitorInviteService.getVisitors(email);
    }

    // Get Most used documents for a specific visitor
    @UseGuards(GqlAuthGuard)
    @Query((returns) => {return InviteSuggestion}, { name: "getMostUsedInviteData"})
    async getMostUsedInviteData(@Args("email") email: string) {
        return await this.visitorInviteService.getMostUsedInviteData(email);
    }

    // Get invites for user type
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Query((returns) => { return [GroupInvite] }, { name: "getInvitesForUserType" })
    async getInvitesForUserType(@Args("permission") permission: number) {
        return await this.visitorInviteService.getInvitesForUserType(permission);
    }

    // Get Visitors suggestions for user
    //@UseGuards(GqlAuthGuard)
    @Query((returns) => {return [Visitor]}, { name: "getSuggestions" })
    async getSuggestions(@Args("date") date: string, @Args("userEmail") userEmail: string) {
        return await this.visitorInviteService.getSuggestions(date,userEmail);
    }

}

