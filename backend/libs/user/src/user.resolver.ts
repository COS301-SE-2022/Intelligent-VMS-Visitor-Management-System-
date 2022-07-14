import { UseGuards, Inject, forwardRef } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "@vms/auth";
import { GqlAuthGuard } from "@vms/auth/guards/GqlAuthGuard.guard";
import { LocalAuthGuard } from "@vms/auth/guards/LocalAuthGuard.guard";
import { CurrentUser } from "@vms/auth/decorators/CurrentUserDecorator.decorator";

import { UserService } from "./user.service";

import { User } from "./models/user.model";
import { SearchUser } from "./models/searchUser.model"; 
import { LoginUser } from "./dto/loginUser.dto";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";

@Resolver((of) => {return User})
export class UserResolver {
    constructor(
        @Inject(forwardRef(() => {return AuthService}))
        private authService: AuthService,
        private userService: UserService,
    ) {}

    @UseGuards(GqlAuthGuard)
    @Query((returns) => {return String}, { name: "helloUser" })
    async hello(@CurrentUser() user: User) {
        return "👋 from to " + user.email + " " + user.permission;
    }

    @UseGuards(GqlAuthGuard,RolesGuard)
    @Roles("admin")
    @Query((returns) => {return SearchUser}, { name: "searchUser"})
    async searchUser(searchQuery: string) {
        return undefined; 
    }

    @UseGuards(LocalAuthGuard)
    @Mutation((returns) => {return LoginUser}, { name: "login" })
    async login(
        @Args("email") email: string,
        @Args("password") password: string,
    ) {
        return await this.authService.login({
            email: email,
            password: password,
        });
    }

    @Mutation((returns) => {return String}, { name: "signup"})
    async signup(
        @Args("email") email: string,
        @Args("password") password: string,
        @Args("type") type: string,
        @Args("idNumber") idNumber: string
    ) {
        return (await this.authService.signup({
            email: email,
            password: password,
            type: type,
            idNumber: idNumber
        })).accepted[0];
    }

    @Mutation((returns) => {return Boolean}, { name: "verify"})
    async verify(@Args("verifyID") verifyID: string, @Args("email") email: string) {
        return this.authService.verifyNewAccount(verifyID, email); 
    }

}
