import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
    @Field((type) => {return String})
    email: string;

    @Field((type) => {return Int})
    permission: number;

    @Field((type) => {return String})
    badges: string;

    @Field((type) => {return String})
    signUpDate: string;
}
