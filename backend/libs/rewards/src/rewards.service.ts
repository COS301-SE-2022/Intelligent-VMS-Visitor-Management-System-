import { Injectable } from '@nestjs/common';
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import { UserService } from '@vms/user';
import { ProfileInfo } from './models/profileInfo.model';
import { GetAllBadgesQuery } from './queries/impl/getAllBadges.query';
import { GetAllRewardsQuery } from './queries/impl/getAllRewards.query';

@Injectable()
export class RewardsService {
    constructor(private queryBus: QueryBus,
                private commandBus: CommandBus,
                private readonly userService: UserService,) {}

    async getProfileInfo(email: string) {
        let user = await this.userService.getUserByEmail(email);
        let allRewards = await this.queryBus.execute(new GetAllRewardsQuery());
        let allBadges = await this.queryBus.execute(new GetAllBadgesQuery());
        
        let pi = new ProfileInfo();
        pi.allBadges = allBadges;
        pi.allRewards = allRewards;
        pi.xp = user.xp;
        pi.badges = user.badges;
        return pi;
    }
}
