export class ReserveParkingCommand {

    //what the command needs to execute, subset of db entries?
    constructor(
        readonly reserverID: string,
        readonly reservationDate: Date,
        readonly parkingNumber: number
    ) {}
  }