import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Visitor, VisitorDocument } from "./schema/visitor.schema";
import { VisitorType } from "./dto/visitor.dto";

@Injectable()
export class VisitorService {
    constructor(
        @InjectModel(Visitor.name) private visitorModel: Model<VisitorDocument>,
    ) {}

    async findAll(): Promise<Visitor[]> {
        return this.visitorModel.find().exec();
    }

    async create(createVisitor: VisitorType): Promise<Visitor> {
        const newVisitor = new this.visitorModel(createVisitor);
        return newVisitor.save();
    }
}
