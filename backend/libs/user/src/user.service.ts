import { ConsoleLogger, forwardRef, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import { SearchUserQuery } from "./queries/impl/searchUser.query";
import { GetUserQuery } from "./queries/impl/getUser.query";
import { GetUnAuthUsersQuery } from "./queries/impl/getUnAuthUsers.query";
import { CreateUserCommand } from "./commands/impl/createUser.command";
import { DeleteUserCommand } from "./commands/impl/deleteUser.command";
import { AuthorizeUserCommand } from "./commands/impl/authorizeUser.command";
import { DeauthorizeUserAccountCommand } from "./commands/impl/deauthorizeUserAccount.command";
import { GetUsersByTypeQuery } from "./queries/impl/getUsersByType.query";
import { GetNumInvitesQuery } from "./queries/impl/getNumInvites.query";
import { RewardsService } from "@vms/rewards";
import { VisitorInviteService } from "@vms/visitor-invite";
import { GetCurfewTimeQuery } from "./queries/impl/getCurfewTime.query";
import { UpdateUserCommand } from "./commands/impl/updateUser.command";
import { GetDaysWithVMSQuery } from "./queries/impl/getDaysWithVMS.query";
import { IncreaseSuggestionsCommand } from "./commands/impl/increaseSuggestions.command";
import { GetNumSuggestionsQuery } from "./queries/impl/getNumSuggestions.query";
import { UpdatePrivilegesCommand } from "./commands/impl/updatePrivileges.command";
import { GetNumSleepoversQuery } from "./queries/impl/getNumSleepovers.query";
import { RestrictionsService } from "@vms/restrictions";
import { UpdateXPCommand } from "./commands/impl/updateXP.command";

@Injectable()
export class UserService{
    constructor(private queryBus: QueryBus, 
                private commandBus: CommandBus, 
                private rewardService: RewardsService,
                @Inject(forwardRef(() => {return VisitorInviteService}))
                private visitorInviteService: VisitorInviteService,
                @Inject(forwardRef(() => {return RestrictionsService}))
                private restrictionService: RestrictionsService,
                ) {}

    async findOne(email: string) {
        return this.queryBus.execute(new GetUserQuery(email));
    }

    async createUser(email: string, password: string, permission: number, idNumber: string, idDocType: string, name: string) {
        const dateString = (new Date()).toLocaleDateString();
        const typeCounts = await this.rewardService.getTypeCounts();
        const badgeCount = (await this.rewardService.getAllBadges()).length;
        let badges ="1";
        for(var i=0;i<badgeCount-1;i++){
            badges += "0";
        }
        return this.commandBus.execute(new CreateUserCommand(email, password, permission, idNumber, idDocType, name, badges, (-1*typeCounts["sleepover"]),(-1*typeCounts["theme"]),(-1*typeCounts["invite"]),(-100*typeCounts["curfew"]), dateString));
    }

    async searchUser(searchQuery: string) {
        return this.queryBus.execute(new SearchUserQuery(searchQuery));
    }

    async getUserByEmail(email: string) {
        return this.queryBus.execute(new GetUserQuery(email));
    }

    async getNumSuggestions(email: string) {
        return this.queryBus.execute(new GetNumSuggestionsQuery(email));
    }
    
    async getUnAuthorizedUsers(permission: number) {
        return this.queryBus.execute(new GetUnAuthUsersQuery(permission === 0 ? -1 : -2));
    }

    async increaseSuggestions(email: string){
        this.commandBus.execute(new IncreaseSuggestionsCommand(email));
    }

    async deleteUserAccount(email: string) {
        const res = await this.commandBus.execute(new DeleteUserCommand(email));
        return res.deletedCount > 0;
    }

    async authorizeUserAccount(email: string) {
        const res = await this.commandBus.execute(new AuthorizeUserCommand(email));        
        return res.modifiedCount > 0;
    }

    async deauthorizeUserAccount(email: string) {
        const res = await this.commandBus.execute(new DeauthorizeUserAccountCommand(email));
        return res.modifiedCount > 0;
    }

    async getUsersByType(permission: number) {
        const users = await this.queryBus.execute(new GetUsersByTypeQuery(permission));
        return users;
    }

    async getDaysWithVMS(email: string) {
        return await this.queryBus.execute(new GetDaysWithVMSQuery(email));
    }

    async updateUser(email: string, badges:string, xp:number) {
        this.commandBus.execute(new UpdateUserCommand(email,badges,xp));
    }

    async getNumSleepovers(email: string) {
        const max = (await this.restrictionService.getMaxSleepovers()).value;
        return (await this.queryBus.execute(new GetNumSleepoversQuery(email)))+max;
    }

    async getNumInvites(email: string) {
        const max = (await this.restrictionService.getNumInvitesPerResident()).value;
        return  (await this.queryBus.execute(new GetNumInvitesQuery(email)))+max;
    }

    async getCurfewTimeOfResident(email: string) {
        const max = (await this.restrictionService.getCurfewTime()).value
        const time = ((await this.queryBus.execute(new GetCurfewTimeQuery(email))))+max;
        return  time%2400;
    }

    async evaluateUser(email:string){
        const sleepovers = await this.visitorInviteService.getTotalNumberOfSleepoversThisMonthOfResident(email);
        const max = await this.getNumSleepovers(email);
        if(max<sleepovers){
            this.commandBus.execute(new UpdateXPCommand(email,-20));
        }
    }

    async updatePrivileges(email:string,xpOld:number,xpCurrent:number){
        const allRewards = await this.rewardService.getAllRewards();
        var invites = 0;
        var sleepovers = 0;
        var themes = 0;
        var curfewHours = 0;

        for await ( let reward of allRewards){
            if(reward.xp<=xpCurrent){
                switch(reward.type){
                    case "invite":
                        if(reward.xp>xpOld){
                            invites++;
                        } else {
                            invites--;
                        }
                        break;
                    case "sleepover":
                        if(reward.xp>xpOld){
                            sleepovers++;
                        } else {
                            sleepovers--;
                        }
                        break;
                    case "theme":
                        if(reward.xp>xpOld){
                            themes++;
                        } else {
                            themes--;
                        }
                        break;
                    case "curfew":
                        if(reward.xp>xpOld){
                            curfewHours++;
                        } else {
                            curfewHours--;
                        }
                        break;
                }
            }
        }

        if(sleepovers!=0 || themes!=0 || invites!=0 || curfewHours!=0){
            this.commandBus.execute(new UpdatePrivilegesCommand(email, sleepovers, themes, invites, curfewHours));
        }

    }

    async calculateBadges(email:string){
        const user = await this.getUserByEmail(email);
        const allBadges = await this.rewardService.getAllBadges();
        let badges = user.badges;

        let variable:number;
        let change = false;
        let xp = 0;
        for await ( let [i,badge] of allBadges.entries()){
            if(parseInt(badges.charAt(i))<badge.levels){
                switch(badge.type){
                    case "invite":
                        variable = await this.visitorInviteService.getTotalNumberOfInvitesOfResident(email);
                        break;
                    // case "concept":
                    //     //for now it is just given
                    //     break;
                    case "cancellation":
                        variable = await this.visitorInviteService.getTotalNumberOfCancellationsOfResident(email);
                        break;
                    case "sleepover":
                        variable = await this.visitorInviteService.getTotalNumberOfSleepoversOfResident(email);
                        break;
                    case "time":
                        variable = await this.getDaysWithVMS(email);
                        break;
                    case "visits":
                        variable = await this.visitorInviteService.getTotalNumberOfVisitsOfResident(email);
                        break;
                    case "suggestion":
                        variable = await this.getNumSuggestions(email);
                        break;

                    default:
                        variable = 0;
                }
                let level = parseInt(badges.charAt(i))+1;
                while(level<=badge.levels){
                    if(badge.requirements[level-1]<=variable){
                        change = true;
                        badges = badges.slice(0,i)+level.toString()+badges.slice(i+1);
                        xp += badge.xp[level-1];
                    }else{
                        break;
                    }
                level++;
                }   
        }
        }

        if(change){
            this.updateUser(email,badges,xp);
            this.updatePrivileges(email,user.xp,user.xp+xp);
        }
    }
}
