import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../../../visitor-invite/src/schema/invite.schema";
import { SignOutInviteCommand } from "../impl";


