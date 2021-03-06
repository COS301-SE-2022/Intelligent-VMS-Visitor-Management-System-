import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { GqlAuthGuard } from "@vms/auth/guards/GqlAuthGuard.guard";
import { Roles } from "@vms/user/decorators/roles.decorator";
import { RolesGuard } from "@vms/user/guards/roles.guard";

import { Restriction } from "./models/restriction.model";
import { RestrictionsService } from "./restrictions.service";

@Resolver((of) => {return Restriction})
export class RestrictionResolver {
    constructor(
        private restrictionsService: RestrictionsService
    ) {}
    
    @UseGuards(GqlAuthGuard)
    @Query((returns) => {return Restriction}, { name: "getNumInvitesPerResident"})
    async getNumInvitesPerResident() {
        return this.restrictionsService.getNumInvitesPerResident();
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Mutation((returns) => {return Restriction}, { name: "setNumInvitesPerResident"})
    async setNumInvitesPerResident(@Args("numInvites") numInvites: number) {
        return this.restrictionsService.setNumInvitesPerResident(numInvites);
    }

}
