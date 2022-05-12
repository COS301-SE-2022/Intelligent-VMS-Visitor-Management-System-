import { ApolloError } from "apollo-server-errors";

export class ParkingNotFound extends ApolloError {
    constructor(message: string) {
        super(message, "PARKING_NOT_FOUND");

        Object.defineProperty(this, "parking_not_found", { value: "MyError" });
    }
}
