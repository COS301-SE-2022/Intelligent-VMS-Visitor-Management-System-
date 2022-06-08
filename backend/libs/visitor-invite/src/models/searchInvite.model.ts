import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SearchInvite {
    @Field((type) => {return String})
    visitorEmail: string;

    @Field((type) => {return String})
    visitorName: string;
}
