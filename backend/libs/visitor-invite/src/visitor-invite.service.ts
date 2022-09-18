import { forwardRef, Inject, Injectable, CACHE_MANAGER } from "@nestjs/common";
import { Cache } from 'cache-manager';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Cron } from '@nestjs/schedule';
import { randomUUID } from "crypto";

import { CreateInviteCommand } from "./commands/impl/createInvite.command";
import { CancelInviteCommand } from "./commands/impl/cancelInvite.command";
import { GetInviteForSignInDataQuery } from "./queries/impl/getInviteForSignInData.query";
import { GetInvitesQuery } from "./queries/impl/getInvites.query";
import { GetInviteQuery } from "./queries/impl/getInvite.query";
import { GetNumberVisitorQuery } from "./queries/impl/getNumberOfVisitors.query";
import { GetInvitesInRangeQuery } from "./queries/impl/getInvitesInRange.query";
import { GetNumberOfInvitesOfResidentQuery } from "./queries/impl/getNumberOfInvitesOfResident.query";
import { GetInvitesByNameQuery } from "./queries/impl/getInvitesByName.query";
import { GetInvitesInRangeByEmailQuery } from "./queries/impl/getInvitesInRangeByEmail.query";
import { GetTotalNumberOfInvitesVisitorQuery } from "./queries/impl/getTotalNumberOfInvitesVisitor.query";
import { GetNumberOfOpenInvitesQuery } from "./queries/impl/getNumberOfOpenInvites.query";
import { GetVisitorsQuery } from "./queries/impl/getVisitors.query";

import { GetInvitesByDateQuery } from "./queries/impl/getInvitesByDate.query";

import { GetInvitesByNameForSearchQuery } from "./queries/impl/getInviteByNameForSearch.query";

import { InviteNotFound } from "./errors/inviteNotFound.error";
import { DateFormatError } from "./errors/dateFormat.error";
import { InviteLimitReachedError } from "./errors/inviteLimitReached.error";
import { NoInvites } from "./errors/noInvites.error";

import { ReserveParkingCommand } from "@vms/parking/commands/impl/reserveParking.command";
import { getTotalAvailableParkingQuery } from '@vms/parking/queries/impl/getTotalAvailableParking.query';
import { ParkingNotFound } from "@vms/parking/errors/parkingNotFound.error";
import { MailService } from "@vms/mail";
import { RestrictionsService } from "@vms/restrictions";
import { ParkingService } from "@vms/parking";
import { CreateGroupInviteCommand } from "./commands/impl/createGroupInvite.command";
import { firstValueFrom } from "rxjs";
import { GetMostUsedInviteDataQuery } from "./queries/impl/getMostUsedInviteData.query";
import { InviteSuggestion } from "./models/inviteSuggestion.model";
import { UserService } from "@vms/user";
import { GetInvitesForUsersQuery } from "./queries/impl/getInvitesForUsers.query";
import { GetVisitorVisitsQuery } from "./queries/impl/getVisitorVisits.query";
import { Visitor } from "./models/visitor.model";

@Injectable()
export class VisitorInviteService {
    AI_BASE_CONNECTION: string;

    constructor(private readonly commandBus: CommandBus, 
                private readonly queryBus: QueryBus, 
                private readonly httpService: HttpService,
                private readonly configService: ConfigService,
                private readonly mailService: MailService,
                private readonly restrictionsService: RestrictionsService,
                private readonly userService: UserService,
                @Inject(CACHE_MANAGER) private cacheManager: Cache,
                @Inject(forwardRef(() => {return ParkingService}))
                private readonly parkingService: ParkingService,
               ) {
        this.AI_BASE_CONNECTION = this.configService.get<string>("AI_API_CONNECTION");
    }

    /*
        Create an invitation for a visitor
    */
    async createInvite(
        permission: number,
        userEmail: string,
        visitorEmail: string,
        visitorName: string,
        idDocType: string,
        idNumber: string,
        inviteDate: string,
        requiresParking: boolean
    ) {

        // If permission level is that of resident check invite limit
        if(permission !== 0 && permission !== 1) {
            const numInvitesAllowed = await this.restrictionsService.getNumInvitesPerResident();
            const numInvitesSent = await this.getTotalNumberOfInvitesOfResident(userEmail);

            if(numInvitesSent >= numInvitesAllowed) {
                throw new InviteLimitReachedError("Max Number of Invites Sent");
            }
        }

        // Check if parking is available
        if(requiresParking) {
            const isParkingAvaliable = await this.parkingService.isParkingAvailable(inviteDate);
            if(!isParkingAvaliable) {
                throw new ParkingNotFound("Parking not available");
            }
        } 

        // Generate inviteID
        const inviteID = randomUUID();
        
        // Entry in db
        await this.commandBus.execute(
            new CreateInviteCommand(
                userEmail,
                visitorEmail,
                visitorName,
                idDocType,
                idNumber,
                inviteDate,
                inviteID,
            ),
        );
        
        // Parking
        if(requiresParking) {
            await this.parkingService.reserveParking(inviteID);
        }

        const info = await this.mailService.sendInvite(visitorEmail, userEmail, inviteID, idDocType, requiresParking, inviteDate);
        return info.messageId;
    }

    /*
        Create an invitation for a visitor specifically used with bulk sign-in
        (The email never gets sent)
    */
        async createInviteForBulkSignIn(
            permission: number,
            userEmail: string,
            visitorEmail: string,
            visitorName: string,
            idDocType: string,
            idNumber: string,
            inviteDate: string,
            requiresParking: boolean
        ) {
    
            // If permission level is that of resident check invite limit
            if(permission !== 0 && permission !== 1) {
                const numInvitesAllowed = await this.restrictionsService.getNumInvitesPerResident();
                const numInvitesSent = await this.getTotalNumberOfInvitesOfResident(userEmail);
    
                if(numInvitesSent >= numInvitesAllowed) {
                    throw new InviteLimitReachedError("Max Number of Invites Sent");
                }
            }
    
            // Generate inviteID
            const inviteID = randomUUID();
    
            // Entry in db
            await this.commandBus.execute(
                new CreateInviteCommand(
                    userEmail,
                    visitorEmail,
                    visitorName,
                    idDocType,
                    idNumber,
                    inviteDate,
                    inviteID,
                ),
            );
    
            // Parking
            if(requiresParking) {
                await this.parkingService.reserveParking(inviteID);
            }
    
            return inviteID;
        }

    async getInvites(email: string) {
        return this.queryBus.execute(new GetInvitesQuery(email));
    }

    //Get invite by ID
    async getInvite(inviteID: string) {
        if(inviteID.length === 0) {
            throw new InviteNotFound("No invite given");
        }
        const invite = await this.queryBus.execute(new GetInviteQuery(inviteID));
        if(!invite) {
            throw new InviteNotFound("Invite not found with id");
        }
        return invite;
    }

    // Get invite by visitor id-number and invite date
    async getInviteForSignInData(idNumber: string, inviteDate: string) {
        return this.queryBus.execute(new GetInviteForSignInDataQuery(idNumber, inviteDate));
    }

    async cancelInvite(email: string, inviteID: string) {

        // Get the invite to delete
        const inviteToDelete = await this.queryBus.execute(new GetInviteQuery(inviteID));  

        // Check if it exists
        if(inviteToDelete) {
            if(inviteToDelete.userEmail === email) {
                await this.parkingService.unreserveParking(inviteID);
                this.mailService.sendCancelNotice(inviteToDelete.visitorEmail,
                                                  inviteToDelete.visitorName,
                                                  inviteToDelete.inviteDate,
                                                  inviteToDelete.userEmail);
                return await this.commandBus.execute(new CancelInviteCommand(inviteID));
            } else {
                throw new InviteNotFound(`Invite was not issued by: ${email}`);
            }
        } else {
            throw new InviteNotFound(`Invite not found with ID: ${inviteID}`);
        }


    }
    //get the total number of invites that have been sent
    async getTotalNumberOfVisitors() {
        return this.queryBus.execute(new GetNumberVisitorQuery());
    } 

    // Check if given dates are valid
    _validateDate(startDate: string, endDate: string) {
        const start = Date.parse(startDate);
        const end = Date.parse(endDate);

        if(isNaN(start) || isNaN(end)) {
            throw new DateFormatError("Given Date is not of the form yyyy-mm-dd");
        } else if(start > end) {
            throw new DateFormatError("Start date can not be later than the end date");
        }

        return true;
    }

    // Get invites in date range
    async getNumInvitesPerDate(dateStart: string, dateEnd: string) {
       this._validateDate(dateStart, dateEnd);
       return await this.queryBus.execute(new GetInvitesInRangeQuery(dateStart, dateEnd));
    }

    // Get invites in date range for an user
    async getNumInvitesPerDateOfUser(dateStart: string, dateEnd: string, email: string) {
       this._validateDate(dateStart, dateEnd);
       return await this.queryBus.execute(new GetInvitesInRangeByEmailQuery(dateStart, dateEnd, email));
    }

    // Get Number of total invites per resident
    async getTotalNumberOfInvitesOfResident(email: string) {
        return await this.queryBus.execute(new GetNumberOfInvitesOfResidentQuery(email)); 
    }

    // Get Number of invites per resident
    async getNumberOfOpenInvites(email: string) {
        const now = new Date();
        const year = now.getFullYear();
        let month = "" + (now.getMonth() + 1);
        let day = "" + now.getDate();

        if (month.length < 2) {
            month = "0" + month;
        }

        if (day.length < 2) {
            day = "0" + day;
        }

        const currDate = [year, month, day].join("-");

        return await this.queryBus.execute(new GetNumberOfOpenInvitesQuery(email,currDate)); 

    }

    // Get All Invites regardless of user
    async getInvitesByDate(date: string) {
        return await this.queryBus.execute(new GetInvitesByDateQuery(date)); 
    }
    
    // Get Invite data by visitor name
    async getInvitesByName(name: string) {
        return await this.queryBus.execute(new GetInvitesByNameQuery(name));
    }

    //Searching for receptionist by name
    async getInvitesByNameForSearch(name: string) {
        return await this.queryBus.execute(new GetInvitesByNameForSearchQuery(name));
    }

    //Searching for receptionist by ID
    async getInvitesByIDForReceptionistSearch(inviteID: string) {
        return await this.queryBus.execute(new GetInviteQuery(inviteID));
    }

    // Get total number of invites of the given visitor
    async getTotalNumberOfInvitesVisitor(email: string) {
        return await this.queryBus.execute(new GetTotalNumberOfInvitesVisitorQuery(email));
    }

    // Get Visitors for User
    async getVisitors(email: string) {
        return await this.queryBus.execute(new GetVisitorsQuery(email));
    }

    // Get Most used document for a specific visitor
    async getMostUsedInviteData(email: string) {
        const data = await this.queryBus.execute(new GetMostUsedInviteDataQuery(email));
            
        if(data.length > 0) {
            const suggestedInvite = data[0];
            const inviteSuggestion = new InviteSuggestion();
            inviteSuggestion.visitorEmail = suggestedInvite.visitorEmail;
            inviteSuggestion.visitorName = suggestedInvite.visitorName;
            inviteSuggestion.idNumber = suggestedInvite.idNumber;
            inviteSuggestion.idDocType = suggestedInvite._id;
            return inviteSuggestion;
        } else {
            throw new NoInvites("No Invites to make suggestion");
        }

    }

    // Get Invites for user type
    async getInvitesForUserType(permission: number) {
        const users = await this.userService.getUsersByType(permission);
        if(users.length > 0) {
            const userEmails = users.map((user) => {
                return user.email;
            });

            const res =  await this.queryBus.execute(new GetInvitesForUsersQuery(userEmails));
            console.log(res);

            return res;
        } 

        return [];
    }

    // Get predicted number of invites in range
    async getPredictedInviteData(startDate: string, endDate: string) {
        const cachedPredictedInvites = await this.cacheManager.get("PREDICTIONS");

        if(cachedPredictedInvites) {
            console.log(cachedPredictedInvites);
            return cachedPredictedInvites;
        } else {
            console.log("MISS");
            const data = await firstValueFrom(this.httpService.get(`${this.AI_BASE_CONNECTION}/predict?startDate=${startDate}&endDate=${endDate}`)); 
            if(data.data.length === 1) {
                return [];
            }
            await this.cacheManager.set("PREDICTIONS", data.data, { ttl: 90000 });
            return data.data;
        }
    }

    getMonthsBetweenDates(startDate, endDate) {
        return (
          endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear())
        );
      }

    getDaysBetweenDates(startDate, endDate) {
        return (
          (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
        );
    }
    
    getWeekdayBetweenDates(startDate, endDate) {
        return (4 * (endDate.getMonth() - startDate.getMonth()) + 52 * (endDate.getFullYear() - startDate.getFullYear()));
    }

    async getSuggestions(date: string, userEmail: string){
        let visitors:Visitor[] = JSON.parse(JSON.stringify(await this.queryBus.execute(new GetVisitorVisitsQuery(userEmail))));
        let predDate = new Date(date);
        let suggestions = [];
        
        const today = new Date();

        for(let i=0 ; i<visitors.length; i++){

            let dowCount = 0;
            let monthCount = 0;
        
            const visitData = JSON.parse(JSON.stringify(visitors[i].visits))
            let firstInviteDate = new Date(visitors[i].visits[0]);

            for(let j=0 ; j<visitData.length; j++)
            {
                const currDate = new Date(visitData[j])
                if(currDate.getMonth() == predDate.getMonth()) {
                    monthCount++;
                }

                if(currDate.getDay() == predDate.getDay()) {
                    dowCount++;
                }

                if(currDate<firstInviteDate) {
                    firstInviteDate = currDate;
                }
            }

            let monthTotal = this.getMonthsBetweenDates(firstInviteDate,today);
            let dayTotal = this.getDaysBetweenDates(firstInviteDate,today);
            let dowTotal = this.getWeekdayBetweenDates(firstInviteDate,today);

            let pYes = monthCount/monthTotal * dowCount/dowTotal * visitors[i].numInvites/dayTotal
            //let pNo = (monthTotal-monthCount)/monthTotal * (dowTotal-dowCount)/dowTotal * (dayTotal-visitors[i].numInvites)/dayTotal

            let suggestion = new Visitor()
            suggestion.visitorName = visitors[i].visitorName;
            suggestion._id = visitors[i]._id;
            suggestion.idNumber = visitors[i].idNumber;
            suggestion.idDocType = visitors[i].idDocType;
            suggestion.prob = pYes;
            suggestions.push(suggestion);
            
                   
        }

        let finalSuggestions =[];

        //sort descending
        suggestions.sort(function(a, b){return b.prob - a.prob});

        //find IQR
        let q3Index = Math.round(1/4*(suggestions.length+1));
        let q1Index = Math.round(3/4*(suggestions.length+1));
        let iqr = suggestions[q3Index].prob - suggestions[q1Index].prob;

        let threshold = suggestions[suggestions.length-1].prob + iqr;

        //filter
        for(let i=0;i<suggestions.length;i++){
            if(suggestions[i].prob<=threshold )
            break;
            else
            finalSuggestions.push(suggestions[i])
        }
        
        return finalSuggestions;
    }

    /* CRON JOBS */
    @Cron("50 23 * * *")
    async groupInvites() {
        // Get current date & time
        const now = new Date();
        const year = now.getFullYear();
        let month = "" + (now.getMonth() + 1);
        let day = "" + now.getDate();
            
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        } 

        const formatDate = [year, month, day].join('-');

        // Get All Invites for date
        const invites = await this.queryBus.execute(new GetInvitesByDateQuery(formatDate));
        
        // Get number of invites
        const numInvites = invites.length;

        // Get signedOut invites
        const visitorInvites = invites.filter((invite) => {
            return invite.inviteState === "signedOut";
        });

        // Get number of signedOut invites
        const numVisitors = visitorInvites.length;

        // Register for the day
        await this.commandBus.execute(new CreateGroupInviteCommand(formatDate, numInvites, numVisitors));
    }

    /* CRON JOBS */
    @Cron("50 23 * * *")
    async cachePredictedVisitors() {
        const now = new Date();
        const startYear = now.getFullYear() - 1;
        let startMonth = "" + (now.getMonth() + 1);
        let startDay = "" + now.getDate();
            
        if (startMonth.length < 2) {
            startMonth = '0' + startMonth;
        }
        if (startDay.length < 2) {
            startDay = '0' + startDay;
        } 
        
        const startDate = [startYear, startMonth, startDay].join("-");

        const endYear = now.getFullYear() - 1;
        let endMonth = "" + (now.getMonth() + 1);
        let endDay = "" + now.getDate();
            
        if (endMonth.length < 2) {
            endMonth = '0' + endMonth;
        }
        if (endDay.length < 2) {
            endDay = '0' + endDay;
        } 

        const endDate = [endYear, endMonth, endDay].join("-");

        const baseURL = this.configService.get<string>("AI_API_CONNECTION");
        const data = await firstValueFrom(this.httpService.get(`${baseURL}/predict?startDate=${startDate}&endDate=${endDate}`)); 
        if(data.data.length === 1) {
            return [];
        }
        await this.cacheManager.set("PREDICTIONS", data.data, { ttl: 900000 });
        return data.data;
    }

}
