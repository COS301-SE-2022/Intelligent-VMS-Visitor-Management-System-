import { Module,forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from '@vms/auth';
import { UserModule } from '@vms/user';
import { GetAllBadgesQueryHandler } from './queries/handlers/getAllBadgesQuery.handler';
import { GetAllRewardsQueryHandler } from './queries/handlers/getAllRewardsQuery.handler';
import { GetMaxRequirementQueryHandler } from './queries/handlers/getMaxRequirementQuery.handler';
import { GetRewardTypesCountQueryHandler } from './queries/handlers/getRewardTypesCountQuery.handler';
import { RewardsResolver } from './rewards.resolver';
import { RewardsService } from './rewards.service';
import { Badge, BadgesSchema } from './schema/badge.schema';
import { Reward, RewardsSchema } from './schema/reward.schema';

@Module({
  imports: [  CqrsModule,
              forwardRef(() => {return AuthModule}),
              forwardRef(() => {return UserModule}),
              MongooseModule.forFeature([
                  { name: Reward.name, schema: RewardsSchema },
                  { name: Badge.name, schema: BadgesSchema },
              ]),
  ],
  providers: [RewardsService,
              RewardsResolver,
              GetAllBadgesQueryHandler,
              GetAllRewardsQueryHandler,
              GetMaxRequirementQueryHandler,
              GetRewardTypesCountQueryHandler
            ],
  exports: [RewardsService],
})
export class RewardsModule {}
