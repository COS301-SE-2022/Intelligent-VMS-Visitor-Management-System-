export class generateTrayCommand {
    constructor(
        public readonly trayID: boolean,
        public readonly inviteID: string,
        public readonly containsResidentID: boolean,
        public readonly containsVisitorID: boolean
        ) {}
}

