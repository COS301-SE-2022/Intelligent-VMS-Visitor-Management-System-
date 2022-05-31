import { ApolloError } from "apollo-server-errors";

export class DateFormatError extends ApolloError {
    constructor(message: string) {
        super(message, "DATE_FORMAT_ERROR");
        Object.defineProperty(this, "invite_not_found", { value: "MyError" });
    }
}
