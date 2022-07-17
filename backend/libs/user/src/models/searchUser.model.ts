import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SearchUser {
    @Field((type) => {return String})
    email: string;

    @Field((type) => {return Int})
    permission: number;

    @Field((type) => {return String})
    name: string;
}
