import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class GroupInvite {
    @Field((type) => {return String}, { nullable: true })
    _id?: string;

    @Field((type)=> {return Number}, { nullable: true })
    numInvites?: number;

    @Field((type) => {return Number}, { nullable: true })
    numVisitors?: number;

    @Field((type) => {return String}, { nullable: true })
    firstDate?: string;
}
