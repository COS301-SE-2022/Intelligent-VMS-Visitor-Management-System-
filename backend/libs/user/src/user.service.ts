import { Injectable } from "@nestjs/common";
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import { GetUserQuery } from "./queries/impl/getUser.query";
import { GetUnAuthUsersQuery } from "./queries/impl/getUnAuthUsers.query";
import { CreateUserCommand } from "./commands/impl/createUser.command";

@Injectable()
export class UserService {
    constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

    async findOne(email: string) {
        return this.queryBus.execute(new GetUserQuery(email));
    }

    async createUser(email: string, password: string, permission: number) {
        return this.commandBus.execute(new CreateUserCommand(email, password, permission));
    }

    async getUnAuthorizedUsers(permission: number) {
        return this.queryBus.execute(new GetUnAuthUsersQuery(permission === 0 ? -1 : -2));
    }
}
