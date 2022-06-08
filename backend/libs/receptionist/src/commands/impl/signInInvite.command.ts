export class SignInInviteCommand {
    constructor(public readonly inviteID: string,
                public readonly notes: string,
                public readonly signInTime: string) {}
}
