import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Reward {
    @Field((type) => {return String})
    type: string;

    @Field((type) => {return Int})
    xp: number;
}
