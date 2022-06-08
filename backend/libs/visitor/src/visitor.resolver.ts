import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { VisitorType } from "./dto/visitor.dto";
import { Visitor } from "./models/visitor.model";
import { VisitorService } from "./visitor.service";

@Resolver((of) => {return Visitor})
export class VisitorResolver {
    constructor(private visitorService: VisitorService) {}

    @Query((returns) => {return String})
    async hello() {
        return "👋";
    }

    @Query((returns) => {return [VisitorType]})
    async visitors() {
        return this.visitorService.findAll();
    }

    @Mutation((returns) => {return VisitorType})
    async createVisitor(@Args("input") input: VisitorType) {
        return this.visitorService.create(input);
    }
}
