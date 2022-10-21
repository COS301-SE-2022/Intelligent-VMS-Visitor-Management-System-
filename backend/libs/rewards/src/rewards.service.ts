import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import { UserService } from '@vms/user';
import { ProfileInfo } from './models/profileInfo.model';
import { GetAllBadgesQuery } from './queries/impl/getAllBadges.query';
import { GetAllRewardsQuery } from './queries/impl/getAllRewards.query';
import { GetMaxRequirementQuery } from './queries/impl/getMaxRequirement.query';
import { GetRewardTypesCountQuery } from './queries/impl/getRewardTypesCount.query';

@Injectable()
export class RewardsService {
    constructor(private queryBus: QueryBus,
                private commandBus: CommandBus,
                @Inject(forwardRef(() => {return UserService}))
                private readonly userService: UserService,) {
    }

    async getProfileInfo(email: string) {

        const user = await this.userService.getUserByEmail(email);
        const allRewards = await this.getAllRewards();
        const allBadges = await this.getAllBadges();
        const maxRequirement = await this.getMaxRequirement();
        
        const pi = new ProfileInfo();
        pi.allBadges = allBadges;
        pi.allRewards = allRewards;
        pi.xp = user.xp;
        pi.badges = user.badges;
        let progress = (user.xp/maxRequirement)*100;

        if(progress > 100){
            progress = 100;
        }  
        pi.progress = progress;

        return pi;
    }

    async getAllBadges(){
        return await this.queryBus.execute(new GetAllBadgesQuery());
    }

    async getAllRewards(){
        return await this.queryBus.execute(new GetAllRewardsQuery());
    }

    async getMaxRequirement(){
        return await this.queryBus.execute(new GetMaxRequirementQuery());
    }

    async getTypeCounts(){
        const counts = await this.queryBus.execute(new GetRewardTypesCountQuery());
        const dict = {}
        for(const type of counts){
            dict[type._id] = type.count;
        }
        return dict;
    }
}
