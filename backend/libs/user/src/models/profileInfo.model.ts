import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ProfileInfo {
    @Field((type) => {return Int})
    xp: number;

    @Field((type) => {return String})
    badges: number;
}
