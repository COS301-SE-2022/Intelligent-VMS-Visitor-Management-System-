import { ApolloError } from "apollo-server-errors";

export class InvalidQuery extends ApolloError {
    constructor(message: string) {
        super(message, "INVALID_QUERY");

        Object.defineProperty(this, "invalid_query", { value: "MyError" });
    }
}
