import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "@vms/auth/guards/GqlAuthGuard.guard";
import { ReceptionistService } from "./receptionist.service";
import { SignInService } from "../sign-in/sign-in.service";
import { SignOutService } from "../sign-out/sign-out.service";
import { Invite } from "@vms/visitor-invite/models/invite.model";
import { BSIdata } from "./models/BSIdata.model";

@UseGuards(GqlAuthGuard)
@Resolver((of) => {return Invite})
export class ReceptionistResolver {
    constructor(
        private receptionistService: ReceptionistService,
        private signInService: SignInService,
        private signOutService: SignOutService
    ) { }

    @Query((returns) => {return String}, { name: "helloReceptionist" })
    async hello() {
        return "👋 from Receptionist";
    }

    @Query((returns) => {return Boolean}, { name: "compareFaces" })
    async compareFaces() {

        return "";
    }

    @Mutation((returns) => {return Number}, { name: "signOut" })
    async signOutInvite( 
        @Args("inviteID") inviteID: string,
    ){
        return await this.signOutService.signOut(inviteID);
    }

    @Mutation((returns) => {return Number}, { name: "signIn" })
    async signIn(
        @Args("inviteID") inviteID: string,
        @Args("notes") notes: string,
        @Args("time") time: string,
    ) {
        return this.signInService.signIn(inviteID, notes, time);
    }

    @Mutation((returns) => {return BSIdata}, { name: "bulkSignIn" })
    async bulkSignIn(
        @Args("file") file: string,
        @Args("userEmail") userEmail: string,
    ) {
        return this.signInService.bulkSignIn(decodeURI(file),userEmail);
    }
}
