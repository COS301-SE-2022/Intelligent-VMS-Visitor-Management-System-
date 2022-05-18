import { ApolloError } from "apollo-server-errors";

export class NoParkingFound extends ApolloError {
    constructor(message: string) {
        super(message, "NO_PARKING_FOUND");

        Object.defineProperty(this, "no_parking_error", { value: "MyError" });
    }
}
