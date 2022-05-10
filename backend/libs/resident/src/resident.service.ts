import { Injectable } from "@nestjs/common";
import {QueryBus} from "@nestjs/cqrs";

@Injectable()
export class ResidentService {
    constructor(private readonly queryBus: QueryBus) {}
}
