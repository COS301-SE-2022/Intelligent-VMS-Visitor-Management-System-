import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
    @Field((type) => {return String})
    email: string;

    @Field((type) => {return Int})
    permission: number;

    @Field((type) => {return String})
    name: string;

    @Field((type) => {return String})
    idNumber: string;

    @Field((type) => {return String}, { nullable: true })
    file: string;
}
