import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Badge } from "./badge.model";
import { Reward } from "./reward.model";

@ObjectType()
export class ProfileInfo {
    @Field((type) => {return Int})
    xp: number;

    @Field((type) => {return String})
    badges: string;

    @Field((type) => {return [Badge]})
    allBadges: Badge[];

    @Field((type) => {return [Reward]})
    allRewards: Reward[];
}
