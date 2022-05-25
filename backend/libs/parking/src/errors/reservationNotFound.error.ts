import { ApolloError } from "apollo-server-errors";

export class ReservationNotFound extends ApolloError {
    constructor(message: string) {
        super(message, "RESERVATION_NOT_FOUND");

        Object.defineProperty(this, "reservation_not_found", { value: "MyError" });
    }
}
