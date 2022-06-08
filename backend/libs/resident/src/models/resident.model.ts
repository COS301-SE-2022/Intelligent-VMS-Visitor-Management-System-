import { Field, ObjectType } from "@nestjs/graphql";
import { Invite } from "@vms/visitor-invite/models/invite.model"; 
import { User } from "@vms/user/models/user.model";

@ObjectType()
export class Resident extends User {
    @Field((type) => {return [Invite]})
    visitors: Invite[];
}
