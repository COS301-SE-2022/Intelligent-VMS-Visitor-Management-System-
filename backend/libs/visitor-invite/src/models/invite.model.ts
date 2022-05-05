import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Invite {
    @Field((type) => String)
    email: string;

    @Field((type) => String)
    IDDocType: string;

    @Field((type) => String)
    IDNumber: string;
}
