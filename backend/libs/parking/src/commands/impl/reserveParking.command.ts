export class ReserveParkingCommand {

    //what the command needs to execute, subset of db entries?
    constructor(
        readonly invitationID: string,
        readonly parkingNumber: number,
        readonly reservationDate: string
    ) {}
  }