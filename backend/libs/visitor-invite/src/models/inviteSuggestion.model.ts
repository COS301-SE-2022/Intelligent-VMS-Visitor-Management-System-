import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class InviteSuggestion {

    @Field((type) => {return String})
    visitorEmail: string;

    @Field((type) => {return String})
    visitorName: string;

    @Field((type) => {return String})
    idDocType: string;

    @Field((type) => {return String})
    idNumber: string;

}

