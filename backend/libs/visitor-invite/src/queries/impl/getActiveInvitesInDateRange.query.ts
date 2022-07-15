export class GetActiveInvitesInDateRangeQuery { 
    constructor(
        public readonly dateStart: string, 
        public readonly dateEnd: string
    ) {}
}

