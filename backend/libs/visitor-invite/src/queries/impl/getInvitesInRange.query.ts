export class GetInvitesInRangeQuery {
    constructor(
        public readonly dateStart: string, 
        public readonly dateEnd: string
    ) {}
}
