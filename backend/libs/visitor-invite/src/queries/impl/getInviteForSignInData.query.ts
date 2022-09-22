export class GetInviteForSignInDataQuery {
    constructor(
        public readonly idNumber: string,
        public readonly inviteDate: string,
        public readonly inviteState: string
    ) {}
}
