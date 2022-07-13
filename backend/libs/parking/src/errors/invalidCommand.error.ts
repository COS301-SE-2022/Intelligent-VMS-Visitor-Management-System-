import { ApolloError } from "apollo-server-errors";

export class InvalidCommand extends ApolloError {
    constructor(message: string) {
        super(message, "INVALID_COMMAND");

        Object.defineProperty(this, "invalid_command", { value: "MyError" });
    }
}
