export class GetInvitesInRangeByEmailQuery {
    constructor(
        public readonly dateStart: string, 
        public readonly dateEnd: string,
        public readonly email: string
    ) {}
}
