export class GetReservationsInRangeQuery {
    constructor(
        public readonly startDate: string,
        public readonly endDate: string
    ) {
    }
}
