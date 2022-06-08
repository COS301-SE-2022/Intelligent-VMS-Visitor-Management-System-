import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "@vms/auth/guards/GqlAuthGuard.guard";
import { ReceptionistService } from "./receptionist.service";
import { SignInService } from "../sign-in/sign-in.service";
import { SignOutService } from "../sign-out/sign-out.service";
import { Invite } from "@vms/visitor-invite/models/invite.model";
import { stringify } from "querystring";

//@UseGuards(GqlAuthGuard)
@Resolver((of) => Invite)
export class ReceptionistResolver {
    constructor(
        private receptionistService: ReceptionistService,
        private signInService: SignInService,
        private signOutService: SignOutService
    ) { }

    @Query((returns) => String, { name: "helloReceptionist" })
    async hello() {
        return "👋 from Receptionist";
    }


    @Mutation((returns) => Number, { name: "signOut" })
    async signOutInvite( 
        @Args("inviteID") inviteID: string,
    ){
        return await this.signOutService.signOut(inviteID);
    }


    @Mutation((returns) => Number, { name: "signIn" })
    async signIn(
        @Args("inviteID") inviteID: string,
        @Args("notes") notes: string,
        @Args("time") time: string,
    ) {
        return this.signInService.signIn(inviteID, notes, time);
    }
}