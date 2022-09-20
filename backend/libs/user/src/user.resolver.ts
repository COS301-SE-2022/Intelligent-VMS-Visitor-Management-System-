import { UseGuards, Inject, forwardRef } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { RolesGuard } from "@vms/user/guards/roles.guard";
import { Roles } from "@vms/user/decorators/roles.decorator";

import { AuthService } from "@vms/auth";
import { GqlAuthGuard } from "@vms/auth/guards/GqlAuthGuard.guard";
import { LocalAuthGuard } from "@vms/auth/guards/LocalAuthGuard.guard";
import { CurrentUser } from "@vms/auth/decorators/CurrentUserDecorator.decorator";

import { UserService } from "./user.service";

import { User } from "./models/user.model";
import { SearchUser } from "./models/searchUser.model"; 
import { LoginUser } from "./dto/loginUser.dto";

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
    @Query((returns) => {return [SearchUser]}, { name: "searchUser"})
    async searchUser(@Args("searchQuery") searchQuery: string) {
        return this.userService.searchUser(searchQuery); 
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

    // Signup new user
    @Mutation((returns) => {return Boolean}, { name: "signup"})
    async signup(
        @Args("email") email: string,
        @Args("password") password: string,
        @Args("type") type: string,
        @Args("IDDocType") idDocType: string,
        @Args("idNumber") idNumber: string,
        @Args("name") name: string,
    ) {
        return (await this.authService.signup({
            email: email,
            password: password,
            type: type,
            idNumber: idNumber,
            idDocType: idDocType,
            name: name
        }));
    }

    // Verify user account with email
    @Mutation((returns) => {return Boolean}, { name: "verify"})
    async verify(@Args("verifyID") verifyID: string, @Args("email") email: string) {
        return this.authService.verifyNewAccount(verifyID, email); 
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Mutation((returns) => {return Boolean}, { name: "updateMaxInvites"})
    async updateMaxInvites(@Args("difference") difference: number) {
        try{
            this.userService.updateMaxInvites(difference);
            return true;
        }catch(e){
            return false;
        }
        
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Mutation((returns) => {return Boolean}, { name: "updateMaxCurfewTime"})
    async updateMaxCurfewTime(@Args("difference") difference: number) {
        try{
            this.userService.updateMaxCurfewTime(difference);
            return true;
        }catch(e){
            return false;
        }
        
    }

    // Get all the unauthorized user accounts
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("receptionist", "admin")
    @Query((returns) => { return [User] }, { name: "getUnauthorizedUsers"})
    async getUnauthorizedUsers(@CurrentUser() user: User) {
        return await this.userService.getUnAuthorizedUsers(user.permission);
    }

    // Delete User Account
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Mutation((returns) => { return Boolean }, { name: "deleteUserAccount" })
    async deleteUserAccount(@Args("email") email: string) {
        return await this.userService.deleteUserAccount(email);
    }
    
    // Authorize User Account
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("receptionist", "admin")
    @Mutation((returns) => { return Boolean }, { name: "authorizeUserAccount" })
    async authorizeUserAccount(@Args("email") email: string) {
        return await this.userService.authorizeUserAccount(email); 
    }

    // Deauthorize User Account
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("receptionist", "admin")
    @Mutation((returns) => { return Boolean }, { name: "deauthorizeUserAccount" })
    async deuthorizeUserAccount(@Args("email") email: string) {
        return await this.userService.deauthorizeUserAccount(email); 
    }

    // @UseGuards(GqlAuthGuard)
    // @Mutation((returns) => { return Boolean }, { name: "calculateBadges" })
    // async calculateBadges(@Args("email") email: string) {
    //     try{
    //         await this.userService.calculateBadges(email); 
    //         return true;
    //     }catch(e){
    //         return false;
    //     }
    // }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Query((returns) => { return [SearchUser] }, { name: "getUsersByType"})
    async getUsersByType(@Args("permission") permission: number) {
        return await this.userService.getUsersByType(permission);
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Query((returns) => { return Number }, { name: "getMaxInvitesPerResident"})
    async getMaxInvitesPerResident() {
        return await this.userService.getMaxInvitesPerResident();
    }

    @UseGuards(GqlAuthGuard)
    @Query((returns) => { return Number }, { name: "getNumInvites"})
    async getNumInvites(@Args("email") email: string) {
        return await this.userService.getNumInvites(email);
    }

    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles("admin")
    @Query((returns) => { return Number }, { name: "getMaxCurfewTimePerResident"})
    async getMaxCurfewTimePerResident() {
        return await this.userService.getMaxCurfewTimePerResident();
    }

    @UseGuards(GqlAuthGuard)
    @Query((returns) => { return Number }, { name: "getCurfewTime"})
    async getCurfewTime(@Args("email") email: string) {
        return await this.userService.getCurfewTime(email);
    }
    

}
