import { Module } from "@nestjs/common";
import { VisitorService } from "./visitor.service";
import { Visitor, VisitorSchema } from "./schema/visitor.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { VisitorResolver } from "./visitor.resolver";
import QRCode from "qrcode";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Visitor.name, schema: VisitorSchema },
        ]),
    ],
    providers: [VisitorService, VisitorResolver],
    exports: [VisitorService],
})
export class VisitorModule {}
