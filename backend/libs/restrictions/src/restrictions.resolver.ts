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
    
    // @UseGuards(GqlAuthGuard)
    // @Query((returns) => {return Restriction}, { name: "getMaxInvitesPerResident"})
    // async getMaxInvitesPerResident() {
    //     return this.restrictionsService.getMaxInvitesPerResident();
    // }

    // @UseGuards(GqlAuthGuard, RolesGuard)
    // @Roles("admin")
    // @Mutation((returns) => {return Restriction}, { name: "setNumInvitesPerResident"})
    // async setNumInvitesPerResident(@Args("numInvites") numInvites: number) {
    //     return this.restrictionsService.setNumInvitesPerResident(numInvites);
    // }

    // @UseGuards(GqlAuthGuard)
    // @Query((returns) => {return Restriction}, { name: "getCurfewTime"})
    // async getCurfewTime() {
    //     return this.restrictionsService.getCurfewTime();
    // }

    // @UseGuards(GqlAuthGuard, RolesGuard)
    // @Roles("admin")
    // @Mutation((returns) => {return Restriction}, { name: "setCurfewTime"})
    // async setCurfewTime(@Args("curfewTime") curfewTime: number) {
    //     return this.restrictionsService.setCurfewTime(curfewTime);
    // }

}
