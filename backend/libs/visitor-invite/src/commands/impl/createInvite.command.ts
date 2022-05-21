export class CreateInviteCommand {
    constructor(
        public readonly userEmail: string,
        public readonly visitorEmail: string,
        public readonly IDDocType: string,
        public readonly IDNumber: string,
        public readonly inviteDate: string,
        public readonly inviteID: string,
    ) {}
}
