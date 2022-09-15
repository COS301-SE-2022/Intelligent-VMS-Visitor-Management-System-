import { Injectable } from "@nestjs/common";
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import { SearchUserQuery } from "./queries/impl/searchUser.query";
import { GetUserQuery } from "./queries/impl/getUser.query";
import { GetUnAuthUsersQuery } from "./queries/impl/getUnAuthUsers.query";
import { CreateUserCommand } from "./commands/impl/createUser.command";
import { DeleteUserCommand } from "./commands/impl/deleteUser.command";
import { AuthorizeUserCommand } from "./commands/impl/authorizeUser.command";
import { DeauthorizeUserAccountCommand } from "./commands/impl/deauthorizeUserAccount.command";
import { GetUsersByTypeQuery } from "./queries/impl/getUsersByType.query";

@Injectable()
export class UserService {
    constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

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

    async getProfileInfo(email: string) {
        return this.queryBus.execute(new GetUserQuery(email));
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
}
