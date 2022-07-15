import { Injectable } from "@nestjs/common";
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "./commands/impl/createUser.command";
import { GetUserQuery } from "./queries/impl/getUser.query";
import { SearchUserQuery } from "./queries/impl/searchUser.query";

@Injectable()
export class UserService {
    constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

    async findOne(email: string) {
        return this.queryBus.execute(new GetUserQuery(email));
    }

    async createUser(email: string, password: string, permission: number) {
        return this.commandBus.execute(new CreateUserCommand(email, password, permission));
    }

    async searchUser(searchQuery: string) {
        return this.queryBus.execute(new SearchUserQuery(searchQuery));
    }

}
