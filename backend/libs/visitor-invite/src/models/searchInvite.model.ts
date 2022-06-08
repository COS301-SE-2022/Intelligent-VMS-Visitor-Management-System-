import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SearchInvite {
    @Field((type) => String)
    visitorEmail: string;

    @Field((type) => String)
    visitorName: string;
}
