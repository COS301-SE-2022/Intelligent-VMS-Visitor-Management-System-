export class ReserveParkingCommand {

    //what the command needs to execute, subset of db entries?
    constructor(
        readonly reservationInviteID: string,
        readonly parkingNumber: number
    ) {}
  }