import { UseGuards, Inject, forwardRef } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "@vms/auth";
import { GqlAuthGuard } from "@vms/auth/guards/GqlAuthGuard.guard";

import { VisitorInviteService } from "./visitor-invite.service";

import { Invite } from "./models/invite.model";
import {CurrentUser} from "@vms/auth/decorators/CurrentUserDecorator.decorator";
import { User } from "@vms/user/models/user.model";
import { RolesGuard } from "@vms/user/guards/roles.guard";
import { Roles } from "@vms/user/decorators/roles.decorator";

@UseGuards(GqlAuthGuard, RolesGuard)
@Roles("admin")
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
        @Args("visitorEmail") email: string,
        @Args("IDDocType") idDocType: string,
        @Args("IDNumber") idNumber: string,
    ) {
        return this.visitorInviteService.createInvite(
            userEmail,
            email,
            idDocType,
            idNumber,
        );
    }

    // Cancel Invite with inviteID
    @Mutation((returns) => Boolean, { name: "cancelInvite" })
    async cancelInvite(@CurrentUser() user: User, @Args("inviteID") inviteID: string) {
        const res = await this.visitorInviteService.cancelInvite(user.email, inviteID);
        return res.acknowledged;
    }
}
