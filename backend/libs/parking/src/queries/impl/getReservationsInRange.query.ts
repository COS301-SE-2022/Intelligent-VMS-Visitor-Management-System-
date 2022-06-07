export class GetReservationInRangeQuery {
    constructor(
        public readonly startDate: string,
        public readonly endDate: string
    ) {
    }
}
