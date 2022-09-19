export class SignOutInviteCommand {
    constructor(public readonly inviteId: string,
                public readonly signOutTime: string, 
                public readonly trayNumber: number) { }
}
