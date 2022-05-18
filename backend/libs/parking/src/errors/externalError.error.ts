import { ApolloError } from "apollo-server-errors";

export class ExternalError extends ApolloError {
    constructor(message: string) {
        super(message, "EXTERNAL_PARKING_ERROR");

        Object.defineProperty(this, "external_parking_error", { value: "MyError" });
    }
}
