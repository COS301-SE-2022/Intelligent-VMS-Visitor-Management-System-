export class GetNumberOfOpenInvitesQuery {
    constructor(
        public readonly email: string, 
        public readonly date: string
    ) {}
}
