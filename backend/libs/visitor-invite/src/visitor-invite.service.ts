import { forwardRef, Inject, Injectable, CACHE_MANAGER } from "@nestjs/common";
import { Cache } from 'cache-manager';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Cron,SchedulerRegistry  } from '@nestjs/schedule';
import { CronJob } from "cron";
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
import { GetNumberOfCancellationsOfResidentQuery } from "./queries/impl/getNumberOfCancellationsOfResident.query";
import { GetNumberOfVisitsOfResidentQuery } from "./queries/impl/getNumberOfVisitsOfResident.query";
import { ExtendInvitesCommand } from "./commands/impl/extendInvites.command";
import { CancelInvitesCommand } from "./commands/impl/cancelInvites.command";
import { GetInvitesOfResidentQuery } from "./queries/impl/getInvitesOfResident.query"
import { GetInviteForSignOutDataQuery } from "./queries/impl/getInviteForSignOutData.query";
import { GetInviteForSignQuery } from "./queries/impl/getInviteForSign.query";

@Injectable()
export class VisitorInviteService  {

    AI_BASE_CONNECTION: string;

    constructor(private readonly commandBus: CommandBus, 
                private readonly queryBus: QueryBus, 
                private readonly httpService: HttpService,
                private readonly configService: ConfigService,
                private readonly mailService: MailService,
                @Inject(forwardRef(() => {return RestrictionsService}))
                private readonly restrictionsService: RestrictionsService,
                @Inject(forwardRef(() => {return UserService}))
                private readonly userService: UserService,
                @Inject(CACHE_MANAGER) private cacheManager: Cache,
                @Inject(forwardRef(() => {return ParkingService}))
                private readonly parkingService: ParkingService,
                private schedulerRegistry: SchedulerRegistry
               ) { 
                    this.AI_BASE_CONNECTION = this.configService.get<string>("AI_API_CONNECTION");   
               
                    const job = new CronJob(`59 23 * * *`, () => {
                        this.extendInvitesJob();
                    })
            
                    this.schedulerRegistry.addCronJob("extendInvites", job);
                    job.start();
                }

    extendInvitesJob(){
        this.commandBus.execute(new ExtendInvitesCommand());  
        this.commandBus.execute(new CancelInvitesCommand());
    }
            
     /*
        Update/synchronise curfew details and cron job
    */
    async setCurfewDetails( curfew:number ){

        const curfewTime = Number(curfew);
        const today = new Date();
        let currMin = today.getMinutes().toString();

        var curfewHour:String;
        var curfewMinute:String;

        if(currMin.length<2){
            currMin = "0"+currMin;
        }

        const currentTime = Number(today.getHours().toString().concat(currMin))

        if(curfewTime < currentTime){
            this.extendInvitesJob();
        }

        if(curfewTime.toString().length>2){
            curfewHour = curfewTime.toString().slice(0,-2);  
        }else{
            curfewHour = "0";
        }
        
        if(curfewTime.toString().length<=1){
            curfewMinute = curfewTime.toString();
        }else{
            curfewMinute = curfewTime.toString().slice(-2);
        }

        this.schedulerRegistry.deleteCronJob("extendInvites");

        const job = new CronJob(`${curfewMinute} ${curfewHour} * * *`, async() => {
            this.extendInvitesJob();
        })

        this.schedulerRegistry.addCronJob("extendInvites", job);
        job.start();
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
        requiresParking: boolean,
        suggestion: boolean
    ) {

        // If permission level is that of resident check invite limit
        if(permission !== 0 && permission !== 1) {
            const numInvitesAllowed = await this.restrictionsService.getNumInvitesPerResident();
            const numInvitesSent = await this.getNumberOfOpenInvites(userEmail);

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

        //Suggestion count
        if(suggestion){
            await this.userService.increaseSuggestions(userEmail);
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
    async getInviteForSignInData(idNumber: string, inviteDate: string, inviteState: string) {
        return this.queryBus.execute(new GetInviteForSignInDataQuery(idNumber, inviteDate, inviteState));
    }

    async getInviteForSignOutData(idNumber: string) {
        return this.queryBus.execute(new GetInviteForSignOutDataQuery(idNumber));
    }

    async getInviteForSign(idNumber: string) {
        return this.queryBus.execute(new GetInviteForSignQuery(idNumber));
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

    // Get Number of cancelled invites per resident
    async getTotalNumberOfCancellationsOfResident(email: string) {
        return await this.queryBus.execute(new GetNumberOfCancellationsOfResidentQuery(email)); 
    }

    // Get Number of sleepovers per resident
    async getTotalNumberOfSleepoversOfResident(email: string) {
        const invites = await this.queryBus.execute(new GetInvitesOfResidentQuery(email));
        let sleepovers = 0; 
        for(const invite of invites){

            if(invite.signInTime && invite.signOutTime && (new Date(invite.signInTime.slice(0,10))).getDate() != (new Date(invite.signOutTime.slice(0,10))).getDate() || invite.inviteState == "extended"){
                sleepovers++;
            }
        }
        return sleepovers;
    }

    // Get Number of sleepovers per resident this month
    async getTotalNumberOfSleepoversThisMonthOfResident(email: string) {
        const today = new Date();
        const monthStart = new Date(today.getFullYear(),today.getMonth(),1);
        const monthEnd = new Date(today.getFullYear(),today.getMonth()+1,0);
        const invites = await this.queryBus.execute(new GetInvitesInRangeByEmailQuery(monthStart.toLocaleDateString().replace(/\//g, '-'),monthEnd.toLocaleDateString().replace(/\//g, '-'),email));
        let sleepovers = 0; 
        for(const invite of invites){

            if(invite.signInTime && invite.signOutTime && (new Date(invite.signInTime.slice(0,10))).getDate() != (new Date(invite.signOutTime.slice(0,10))).getDate() || invite.inviteState == "extended"){
                sleepovers++;
            }
        }
        return sleepovers;
    }

    // Get Number of cancelled invites per resident
    async getTotalNumberOfVisitsOfResident(email: string) {
        return await this.queryBus.execute(new GetNumberOfVisitsOfResidentQuery(email)); 
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
        const data = await firstValueFrom(this.httpService.get(`${this.AI_BASE_CONNECTION}/getCache?startDate=${startDate}&endDate=${endDate}`)); 
        
        if(data.data.length === 0) {
            this.httpService.get(`${this.AI_BASE_CONNECTION}/predictAsync?startDate=2022-01-01&endDate=2022-12-31`)
        }

        return data.data;
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
        const visitors:Visitor[] = JSON.parse(JSON.stringify(await this.queryBus.execute(new GetVisitorVisitsQuery(userEmail))));
        const predDate = new Date(date);
        const suggestions = [];
        
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

            const monthTotal = this.getMonthsBetweenDates(firstInviteDate,today);
            const dayTotal = this.getDaysBetweenDates(firstInviteDate,today);
            const dowTotal = this.getWeekdayBetweenDates(firstInviteDate,today);

            const pYes = monthCount/monthTotal * dowCount/dowTotal * visitors[i].numInvites/dayTotal
            //let pNo = (monthTotal-monthCount)/monthTotal * (dowTotal-dowCount)/dowTotal * (dayTotal-visitors[i].numInvites)/dayTotal
            
            const suggestion = new Visitor()
            suggestion.visitorName = visitors[i].visitorName;
            suggestion._id = visitors[i]._id;
            suggestion.idNumber = visitors[i].idNumber;
            suggestion.idDocType = visitors[i].idDocType;
            suggestion.prob = pYes;
            suggestions.push(suggestion);
           
        }

        const finalSuggestions =[];

        //sort descending
        suggestions.sort(function(a, b){return b.prob - a.prob});

        //find IQR
        const q3Index = Math.round(1/4*(suggestions.length+1));
        let q1Index = Math.round(3/4*(suggestions.length+1));
        if(q1Index == suggestions.length){
            q1Index -= 1;
        }
        const iqr = suggestions[q3Index].prob - suggestions[q1Index].prob;

        const threshold = suggestions[suggestions.length-1].prob + iqr;

        //filter
        for(let i=0;i<suggestions.length;i++){
            if(suggestions[i].prob<=threshold ) {
                continue;
            } else {
                finalSuggestions.push(suggestions[i])
            }
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

    @Cron("10 23 * * *")
    async createCache() {
        const baseURL = this.configService.get<string>("AI_API_CONNECTION");
        const data = await firstValueFrom(this.httpService.get(`${baseURL}/predictAsync?startDate=2022-01-01&endDate=2022-12-31`)); 
        if(data.data.length === 1) {
            return [];
        }
    }

}
