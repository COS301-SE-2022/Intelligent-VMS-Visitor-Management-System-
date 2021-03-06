import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
    @Field((type) => {return String})
    email: string;

    @Field((type) => {return Int})
    permission: number;
}
