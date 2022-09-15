import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { GqlAuthGuard } from "@vms/auth/guards/GqlAuthGuard.guard";
import { Roles } from "@vms/user/decorators/roles.decorator";
import { RolesGuard } from "@vms/user/guards/roles.guard";

import { Reward } from "./models/reward.model";
import { ProfileInfo } from "./models/profileInfo.model";
import { RewardsService } from "./rewards.service";

@Resolver((of) => {return Reward})
export class RewardsResolver {
    constructor(
        private rewardsService: RewardsService
    ) {}
    
    // @UseGuards(GqlAuthGuard)
    // @Query((returns) => {return Reward}, { name: "getAllBadges"})
    // async getNumInvitesPerResident() {
    //     return this.rewardsService.getAllBadges();
    // }

    //@UseGuards(GqlAuthGuard)
    @Query((returns) => {return ProfileInfo}, { name: "getProfileInfo"})
    async getProfileInfo(@Args("email") email: string) {
        return this.rewardsService.getProfileInfo(email); 
    }

}
