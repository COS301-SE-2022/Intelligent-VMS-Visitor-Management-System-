import {AdjustParkingCommand} from "../impl/adjustParking.command"
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";

@CommandHandler(AdjustParkingCommand)
export class AdjustParkingCommandHandler implements ICommandHandler<AdjustParkingCommand> {
    constructor(
        @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
    ) {}
  
    //db stuff for adding parking
    async execute(command: AdjustParkingCommand): Promise<Parking> {
        const { numDesiredSpots } = command;
    //   const spaces = await this.parkingModel.find();
  
       const parkingSpace = new Parking();
    
    //   parkingSpace.parkingNumber=spaces.length+1;
    //   parkingSpace.visitorEmail="";
    //   parkingSpace.enabled= true;
  
       return await this.parkingModel.create(parkingSpace);
    }
  }