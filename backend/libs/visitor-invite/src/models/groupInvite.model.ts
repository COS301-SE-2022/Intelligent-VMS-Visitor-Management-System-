import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class GroupInvite {
    @Field((type) => String, { nullable: true })
    _id?: string;

    @Field((type)=> Number, { nullable: true })
    numInvites?: number;

    @Field((type) => Number, { nullable: true })
    numVisitors?: number;

    @Field((type) => String, { nullable: true })
    firstDate?: string;
}
