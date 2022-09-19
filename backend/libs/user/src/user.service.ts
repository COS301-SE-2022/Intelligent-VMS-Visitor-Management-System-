import { forwardRef, Inject, Injectable } from "@nestjs/common";
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
import { GetMaxInvitesPerResidentQuery } from "./queries/impl/getMaxInvitesPerResident.query";
import { UpdateMaxInvitesCommand } from "./commands/impl/updateMaxInvites.command";
import { RewardsService } from "@vms/rewards";
import { Badge } from "@vms/rewards/models/badge.model";
import { VisitorInviteService } from "@vms/visitor-invite";
import { GetCurfewTimeQuery } from "./queries/impl/getCurfewTime.query";
import { UpdateMaxCurfewTimeCommand } from "./commands/impl/updateMaxCurfewTime.command";
import { GetMaxCurfewTimePerResidentQuery } from "./queries/impl/getMaxCurfewTimePerResident.query";

@Injectable()
export class UserService {
    constructor(private queryBus: QueryBus, 
                private commandBus: CommandBus, 
                private rewardService: RewardsService,
                @Inject(forwardRef(() => {return VisitorInviteService}))
                private visitorInviteService: VisitorInviteService
                ) {}

    async findOne(email: string) {
        return this.queryBus.execute(new GetUserQuery(email));
    }

    async createUser(email: string, password: string, permission: number, idNumber: string, idDocType: string, name: string) {
        let dateString = (new Date).toLocaleDateString();
        return this.commandBus.execute(new CreateUserCommand(email, password, permission, idNumber, idDocType, name, dateString));
    }

    async searchUser(searchQuery: string) {
        return this.queryBus.execute(new SearchUserQuery(searchQuery));
    }

    async getUserByEmail(email: string) {
        return this.queryBus.execute(new GetUserQuery(email));
    }

    async getNumInvites(email: string) {
        return this.queryBus.execute(new GetNumInvitesQuery(email));
    }

    async getMaxInvitesPerResident() {
        return this.queryBus.execute(new GetMaxInvitesPerResidentQuery());
    }

    async updateMaxInvites(difference: number) {
        return this.commandBus.execute(new UpdateMaxInvitesCommand(difference));
    }

    async getCurfewTime(email: string) {
        return this.queryBus.execute(new GetCurfewTimeQuery(email));
    }

    async getMaxCurfewTimePerResident() {
        return this.queryBus.execute(new GetMaxCurfewTimePerResidentQuery());
    }

    async updateMaxCurfewTime(difference: number) {
        return this.commandBus.execute(new UpdateMaxCurfewTimeCommand(difference));
    }
    
    async getUnAuthorizedUsers(permission: number) {
        return this.queryBus.execute(new GetUnAuthUsersQuery(permission === 0 ? -1 : -2));
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

    async calculateBadges(email:string){
        const user = await this.getUserByEmail(email);
        const allBadges = await this.rewardService.getAllBadges(); 
        const badges = user.badges;

        let variable:number;
        allBadges.forEach(async (badge:Badge,i:number)=>{
            if(badges[i]<badge.levels){
                switch(badge.type){
                    case "invite":
                        variable = await this.visitorInviteService.getTotalNumberOfInvitesOfResident(email);
                        break;
                    case "concept":
                        //todo fuck knows
                        break;
                    case "cancellation":
                        variable = await this.visitorInviteService.getTotalNumberOfCancellationsOfResident(email);
                        break;
                    case "sleepover":
                        break;
                    case "visits":
                        variable = await this.visitorInviteService.getTotalNumberOfVisitsOfResident(email);
                        break;
                }
                let level = badges[i]+1;
                while(level<=badge.levels){
                    if(badge.requirements[level]>=variable){
                        //TODO check if this is a thing
                        badges[i]=level;
                    }else{
                        break;
                    }
                }
            }
        })
            
    }
}
