import { ObjectType, Field, InputType } from "@nestjs/graphql";

@ObjectType("LoginUser")
@InputType("UserInputType")
export class LoginUser {
    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    access_token?: string;
}
