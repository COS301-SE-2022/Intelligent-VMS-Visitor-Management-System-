import joblib
from sklearn import ensemble
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from datetime import date, timedelta, datetime
from dateutil.relativedelta import relativedelta
import math

from app.database import invitesCollection,groupInvitesCollection,parkingReservationCollection,groupParkingReservationsCollection
from app.holidaysSA import ourHolidays

import json 
import joblib
import time

global start_date

invite = invitesCollection.find_one({})
if(invite):
  start_date = datetime.strptime(invite['inviteDate'], '%Y-%m-%d').date()
else:
  start_date = date(2016,1,1)

#################################################################

def createVisData(month,dow,mn_dow,mdn_dow,min_dow,max_dow,mn_days,mn_month,mdn_month,min_month,max_month,mn_months,mn_woy,mdn_woy,min_woy,max_woy,mn_weeks,db,wb,hol):
  row = [
      month,
      dow,
      mn_dow,
      mdn_dow,
      min_dow,
      max_dow,
      mn_days,
      mn_month,
      mdn_month,
      min_month,
      max_month,
      mn_months,
      mn_woy,
      mdn_woy,
      min_woy,
      max_woy,
      mn_weeks,
      db,
      wb,
      hol
  ]
  return row

def createResData(month,dow,mn_dow,mdn_dow,min_dow,max_dow,mn_days,mn_month,mdn_month,min_month,max_month,mn_months,mn_woy,mdn_woy,min_woy,max_woy,mn_weeks,db,wb,numVis,hol):
  row = [
      month,
      dow,
      mn_dow,
      mdn_dow,
      min_dow,
      max_dow,
      mn_days,
      mn_month,
      mdn_month,
      min_month,
      max_month,
      mn_months,
      mn_woy,
      mdn_woy,
      min_woy,
      max_woy,
      mn_weeks,
      db,
      wb,
      numVis,
      hol
  ]
  return row

#################################################################

# MON=0 SUN=7
def calculateDaysPerDOW():
  totalDaysPerDOW = []
  endDate = date.today() - timedelta(days=1)

  difference = (start_date.weekday()-endDate.weekday())

  if(difference>0):
    daysToSubtract = 7-difference
  else:
    daysToSubtract = abs(difference)

  intermed_date = endDate - timedelta(days=daysToSubtract)
  numOfEach = int((intermed_date-start_date).days/7)

  for i in range(7):
    totalDaysPerDOW.append(numOfEach)

  delta = timedelta(days=1)
  while intermed_date < endDate:
      intermed_date += delta
      totalDaysPerDOW[intermed_date.weekday()]+=1

  print("Total Days Per Day of Week")
  print(totalDaysPerDOW)
  print()

  return totalDaysPerDOW

def calculateWeeksPerWOY():
  totalWeeksPerWOY = []
  endDate = date.today() - timedelta(days=1)

  intermed_date = date(endDate.year,start_date.month,start_date.day)
  forEach = int((intermed_date.year-start_date.year))

  for i in range(52):
    totalWeeksPerWOY.append(forEach)
  totalWeeksPerWOY.append(0)

  #leap years might have an extra week
  loop_date = date(start_date.year, 12, 31)
  while loop_date.year < endDate.year:
    if(loop_date.isocalendar()[1] == 53):
      totalWeeksPerWOY[52]+=1
    loop_date = date(loop_date.year+1,12,31)

  #Count weeks bt start day and end day in the same year
  delta = timedelta(days=7)
  if(intermed_date<endDate):
  
    while intermed_date.isocalendar()[1] <= endDate.isocalendar()[1]:
      totalWeeksPerWOY[intermed_date.isocalendar()[1]-1]+=1
      intermed_date += delta

  elif(intermed_date>endDate):
    
    loop_date = endDate
    while loop_date.isocalendar()[1] <= intermed_date.isocalendar()[1]:
      totalWeeksPerWOY[loop_date.isocalendar()[1]-1]-=1
      loop_date += delta

  print("Total Weeks Per Week of the Year")
  print(totalWeeksPerWOY)
  print()

  return totalWeeksPerWOY

# JAN=0 #DEC=11
def calculateMonthsPerMonth():
  totalMonthsPerMonth = []
  endDate = date.today() - timedelta(days=1)

  intermed_date = date(endDate.year,start_date.month,start_date.day)
  forEach = int((intermed_date.year-start_date.year))

  for i in range(12):
    totalMonthsPerMonth.append(forEach)

  #Count months bt start day and end day in the same year
  delta = relativedelta(months=1)
  if(intermed_date<endDate):
  
    while intermed_date.month <= endDate.month:
      totalMonthsPerMonth[intermed_date.month-1]+=1
      intermed_date += delta

  elif(intermed_date>endDate):
    
    loop_date = endDate
    while loop_date.month <= intermed_date.month:
      totalMonthsPerMonth[loop_date.month-1]-=1
      loop_date += delta

  print("Total Months per Month")
  print(totalMonthsPerMonth)
  print()

  return totalMonthsPerMonth

##################################################Calculations

def calculateMeans():

    mnVisDOW = []
    mnVisWOY = []
    mnVisMonth = []

    mnResDOW = []
    mnResWOY = []
    mnResMonth = []

    visitorsPerMonth = []
    visitorsPerWOY = []
    visitorsPerDOW = []

    resPerMonth = []
    resPerWOY = []
    resPerDOW = []

    for i in range(7):
        visitorsPerDOW.append(0)
        mnVisDOW.append(0)
        resPerDOW.append(0)
        mnResDOW.append(0)

    for i in range(12):
        visitorsPerMonth.append(0)
        mnVisMonth.append(0)
        resPerMonth.append(0)
        mnResMonth.append(0)

    for i in range(53):
        visitorsPerWOY.append(0)
        mnVisWOY.append(0)
        resPerWOY.append(0)
        mnResWOY.append(0)

    groupInvites = list(groupInvitesCollection.find({"_id": {'$lt' : date.today().strftime("%Y-%m-%d") }}))
    for group in groupInvites:
      currDate = datetime.strptime(group['_id'], '%Y-%m-%d').date()

      visitorsPerMonth[currDate.month-1]+= group['numVisitors']
      visitorsPerDOW[currDate.weekday()]+= group['numVisitors']
      visitorsPerWOY[currDate.isocalendar()[1]-1]+= group['numVisitors']

    groupReservations = list(groupParkingReservationsCollection.find({"_id": {'$lt' : date.today().strftime("%Y-%m-%d") }}))
    for group in groupReservations:
      currDate = datetime.strptime(group['_id'], '%Y-%m-%d').date()

      resPerMonth[currDate.month-1]+= group['numParkings']
      resPerDOW[currDate.weekday()]+= group['numParkings']
      resPerWOY[currDate.isocalendar()[1]-1]+= group['numParkings']

    totalDaysPerDOW = calculateDaysPerDOW()
    totalWeeksPerWOY = calculateWeeksPerWOY()
    totalMonthsPerMonth = calculateMonthsPerMonth()

    #MN-DOW
    for i in range(7):
        if(totalDaysPerDOW[i]!=0):
            mnVisDOW[i] = visitorsPerDOW[i]/totalDaysPerDOW[i]
            mnResDOW[i] = resPerDOW[i]/totalDaysPerDOW[i]

    #MN-WOY
    for i in range(53):
        if(totalWeeksPerWOY[i]!=0):
            mnVisWOY[i] = visitorsPerWOY[i]/totalWeeksPerWOY[i]
            mnResWOY[i] = resPerWOY[i]/totalWeeksPerWOY[i]
        
    #MN-Month
    for i in range(12):
        if(totalMonthsPerMonth[i]!=0):
            mnVisMonth[i] = visitorsPerMonth[i]/totalMonthsPerMonth[i]
            mnResMonth[i] = resPerMonth[i]/totalMonthsPerMonth[i]

    return mnVisDOW,mnVisWOY,mnVisMonth,mnResDOW,mnResWOY,mnResMonth

def calculateRecentVisitorAverages(invDate):
    jumpYear = timedelta(days=365)

    intermed_date = invDate-jumpYear; #counting back a year
    startString= intermed_date.strftime("%Y-%m-%d")
    endString= invDate.strftime("%Y-%m-%d")

    inviteCount = invitesCollection.count_documents({ "inviteDate": {"$gt": startString, "$lt":endString}})

    mnVisMonths=inviteCount/12
    mnVisWeeks=inviteCount/52
    mnVisDays=inviteCount/365

    return mnVisDays,mnVisWeeks,mnVisMonths
    
def calculateRecentReservationAverages(invDate):
    jumpYear = timedelta(days=365)

    intermed_date = invDate-jumpYear; #counting back a year
    startString= intermed_date.strftime("%Y-%m-%d")
    endString= invDate.strftime("%Y-%m-%d")

    resCount = parkingReservationCollection.count_documents({ "reservationDate": {"$gt": startString, "$lt":endString}})
    mnResMonths=resCount/12
    mnResWeeks=resCount/52
    mnResDays=resCount/365

    return mnResDays,mnResWeeks,mnResMonths

def calculateMinMaxAndMedians():
  groupInvites = list(groupInvitesCollection.find())
  groupReservations = list(groupParkingReservationsCollection.find())

  minVisDOW = []
  maxVisDOW = []
  mdnVisDOW = [] 
  minVisWOY = []
  maxVisWOY = []
  mdnVisWOY = []
  minVisMonth = []
  maxVisMonth = []
  mdnVisMonth = []

  minResDOW = []
  maxResDOW = []
  mdnResDOW = [] 
  minResWOY = []
  maxResWOY = []
  mdnResWOY = []
  minResMonth = []
  maxResMonth = []
  mdnResMonth = []

  for i in range(7):
        minVisDOW.append(math.inf)
        maxVisDOW.append(0)
        mdnVisDOW.append(0)

        minResDOW.append(math.inf)
        maxResDOW.append(0)
        mdnResDOW.append(0)

  for i in range(12):
      minVisMonth.append(math.inf)
      maxVisMonth.append(0)
      mdnVisMonth.append(0)

      minResMonth.append(math.inf)
      maxResMonth.append(0)
      mdnResMonth.append(0)
      
  for i in range(53):
      minVisWOY.append(math.inf)
      maxVisWOY.append(0)
      mdnVisWOY.append(0)

      minResWOY.append(math.inf)
      maxResWOY.append(0)
      mdnResWOY.append(0)

  for day in groupReservations:
    print(day)
    currDate = datetime.strptime(day['_id'], '%Y-%m-%d').date()
    numParking = day['numParkings']
    currMonthIndex = currDate.month-1
    currDayIndex = currDate.weekday()
    currWOYIndex = currDate.isocalendar()[1]-1
    
    if(numParking<minResDOW[currDayIndex]):
      minResDOW[currDayIndex] = numParking
    elif(numParking>maxResDOW[currDayIndex]):
      maxResDOW[currDayIndex] = numParking

    if(numParking<minResWOY[currWOYIndex]):
      minResWOY[currWOYIndex] = numParking
    elif(numParking>maxResWOY[currWOYIndex]):
      maxResWOY[currWOYIndex] = numParking

    if(numParking<minResMonth[currMonthIndex]):
      minResMonth[currMonthIndex] = numParking
    elif(numParking>maxResMonth[currMonthIndex]):
      maxResMonth[currMonthIndex] = numParking

  for day in groupInvites:
    print(day)
    currDate = datetime.strptime(day['_id'], '%Y-%m-%d').date()
    numVisitors = day['numVisitors']
    currMonthIndex = currDate.month-1
    currDayIndex = currDate.weekday()
    currWOYIndex = currDate.isocalendar()[1]-1
    
    if(numVisitors<minVisDOW[currDayIndex]):
      minVisDOW[currDayIndex] = numVisitors
    elif(numVisitors>maxVisDOW[currDayIndex]):
      maxVisDOW[currDayIndex] = numVisitors

    if(numVisitors<minVisWOY[currWOYIndex]):
      minVisWOY[currWOYIndex] = numVisitors
    elif(numVisitors>maxVisWOY[currWOYIndex]):
      maxVisWOY[currWOYIndex] = numVisitors

    if(numVisitors<minVisMonth[currMonthIndex]):
      minVisMonth[currMonthIndex] = numVisitors
    elif(numVisitors>maxVisMonth[currMonthIndex]):
      maxVisMonth[currMonthIndex] = numVisitors


  for i in range(7):
    mdnVisDOW[i] = (minVisDOW[i]+maxVisDOW[i])/2

    mdnResDOW[i] = (minResDOW[i]+maxResDOW[i])/2

  for i in range(12):
    mdnVisMonth[i]= (minVisMonth[i]+maxVisMonth[i])/2

    mdnResMonth[i]= (minResMonth[i]+maxResMonth[i])/2
      
  for i in range(53):
    mdnVisWOY[i] = (minVisWOY[i]+maxVisWOY[i])/2

    mdnResWOY[i] = (minResWOY[i]+maxResWOY[i])/2

  return minVisDOW,maxVisDOW,mdnVisDOW,minVisWOY,maxVisWOY,mdnVisWOY,minVisMonth,maxVisMonth,mdnVisMonth,minResDOW,maxResDOW,mdnResDOW,minResWOY,maxResWOY,mdnResWOY,minResMonth,maxResMonth,mdnResMonth

def getNumVisitorsDayBefore(date):
  group = groupInvitesCollection.find_one({ "_id": (date-timedelta(days=1)).strftime("%Y-%m-%d")})
  if(group):
    return group['numVisitors']
  else:
    return 0

def getNumVisitors(date):
  group = groupInvitesCollection.find_one({ "_id": (date).strftime("%Y-%m-%d")})
  if(group):
    return group['numVisitors']
  else:
    return 0
  
def getNumVisitorsWeekBefore(date):
  return invitesCollection.count_documents({ "inviteDate": {'$gte': (date-timedelta(days=7)).strftime("%Y-%m-%d") , '$lt': date.strftime("%Y-%m-%d")} , "inviteState": { '$ne': "inActive" } })

def getNumParkingsDayBefore(date):
  group = groupInvitesCollection.find_one({ "_id": (date-timedelta(days=1)).strftime("%Y-%m-%d")})
  if(group):
    return group['numParkings']
  else:
    return 0
  
def getNumParkingsWeekBefore(date):
  return parkingReservationCollection.count_documents({ "reservationDate": {'$gte': (date-timedelta(days=7)).strftime("%Y-%m-%d") , '$lt': date.strftime("%Y-%m-%d")}})

def getNumInvites(date):
  temp = groupInvitesCollection.find_one({"_id": date.strftime("%Y-%m-%d") })
  if(temp):
    return temp['numInvites']
  else:
    return 0

def isHoliday(date):
  if( date in ourHolidays):
    return 1
  else:
    return 0

def generateTrainingData():
  visData = []
  visOutput = []
  resData = []
  resOutput = []

  mnVisDOW,mnVisWOY,mnVisMonth,mnResDOW,mnResWOY,mnResMonth = calculateMeans()
  minVisDOW,maxVisDOW,mdnVisDOW,minVisWOY,maxVisWOY,mdnVisWOY,minVisMonth,maxVisMonth,mdnVisMonth,minResDOW,maxResDOW,mdnResDOW,minResWOY,maxResWOY,mdnResWOY,minResMonth,maxResMonth,mdnResMonth = calculateMinMaxAndMedians()

  groupInvites = list(groupInvitesCollection.find())
  groupReservations = list(groupParkingReservationsCollection.find())

  for day in groupInvites:
      cDate = datetime.strptime(day['_id'], '%Y-%m-%d').date()

      monthIndex = cDate.month-1
      woyIndex = cDate.isocalendar()[1]-1
      dayIndex = cDate.weekday()

      mnVisDays,mnVisWeeks,mnVisMonths = calculateRecentVisitorAverages(cDate)

      vDayBef =  getNumVisitorsDayBefore(cDate)
      vWeekBef = getNumVisitorsWeekBefore(cDate)
      hol = isHoliday(cDate)
      numVis = day['numVisitors']

      visOutput.append(numVis)

      visData.append(
      createVisData(
          monthIndex,
          dayIndex,
          mnVisDOW[dayIndex],
          mdnVisDOW[dayIndex],
          minVisDOW[dayIndex],
          maxVisDOW[dayIndex],
          mnVisDays,
          mnVisMonth[monthIndex],
          mdnVisMonth[monthIndex],
          minVisMonth[monthIndex],
          maxVisMonth[monthIndex],
          mnVisMonths,
          mnVisWOY[woyIndex],
          mdnVisWOY[woyIndex],
          minVisWOY[woyIndex],
          maxVisWOY[woyIndex],
          mnVisWeeks,
          vDayBef,
          vWeekBef,
          hol
          )
        )

  for day in groupReservations:
      cDate = datetime.strptime(day['_id'], '%Y-%m-%d').date()

      monthIndex = cDate.month-1
      woyIndex = cDate.isocalendar()[1]-1
      dayIndex = cDate.weekday()

      mnResDays,mnResWeeks,mnResMonths = calculateRecentReservationAverages(cDate)

      rDayBef =  getNumVisitorsDayBefore(cDate)
      rWeekBef = getNumVisitorsWeekBefore(cDate)
      hol = isHoliday(cDate)
      numVis = getNumVisitors(cDate)

      resOutput.append(day['numParkings'])

      resData.append(
        createResData(
            monthIndex,
            dayIndex,
            mnResDOW[dayIndex],
            mdnResDOW[dayIndex],
            minResDOW[dayIndex],
            maxResDOW[dayIndex],
            mnResDays,
            mnResMonth[monthIndex],
            mdnResMonth[monthIndex],
            minResMonth[monthIndex],
            maxResMonth[monthIndex],
            mnResMonths,
            mnResWOY[woyIndex],
            mdnResWOY[woyIndex],
            minResWOY[woyIndex],
            maxResWOY[woyIndex],
            mnResWeeks,
            rDayBef,
            rWeekBef,
            numVis,
            hol
            )
          )

  return visData,resData,visOutput,resOutput

##################################################################

def predictMany(startingDate,endingDate):

  startTime = time.time()

  visReg = joblib.load("VMS_visitor-reg-model.pkl")
  parkReg = joblib.load("VMS_parking-reg-model.pkl")

  output = []

  startDate = datetime.strptime(startingDate, '%Y-%m-%d').date()
  endDate = datetime.strptime(endingDate, '%Y-%m-%d').date()

  mnVisDOW,mnVisWOY,mnVisMonth,mnResDOW,mnResWOY,mnResMonth = calculateMeans()
  minVisDOW,maxVisDOW,mdnVisDOW,minVisWOY,maxVisWOY,mdnVisWOY,minVisMonth,maxVisMonth,mdnVisMonth,minResDOW,maxResDOW,mdnResDOW,minResWOY,maxResWOY,mdnResWOY,minResMonth,maxResMonth,mdnResMonth = calculateMinMaxAndMedians()

  delta = timedelta(days=1)
  loopDate = startDate
  while loopDate <= endDate:

    monthIndex = loopDate.month-1
    woyIndex = loopDate.isocalendar()[1]-1
    dayIndex = loopDate.weekday()

    mnVisDays,mnVisWeeks,mnVisMonths = calculateRecentVisitorAverages(loopDate)
    mnResDays,mnResWeeks,mnResMonths = calculateRecentReservationAverages(loopDate)
  
    vDayBef =  getNumVisitorsDayBefore(loopDate)
    vWeekBef = getNumVisitorsWeekBefore(loopDate)
    rDayBef =  getNumVisitorsDayBefore(loopDate)
    rWeekBef = getNumVisitorsWeekBefore(loopDate)
    hol = isHoliday(loopDate)

    visPred = visReg.predict([
      createVisData(
          monthIndex,
          dayIndex,
          mnVisDOW[dayIndex],
          mdnVisDOW[dayIndex],
          minVisDOW[dayIndex],
          maxVisDOW[dayIndex],
          mnVisDays,
          mnVisMonth[monthIndex],
          mdnVisMonth[monthIndex],
          minVisMonth[monthIndex],
          maxVisMonth[monthIndex],
          mnVisMonths,
          mnVisWOY[woyIndex],
          mdnVisWOY[woyIndex],
          minVisWOY[woyIndex],
          maxVisWOY[woyIndex],
          mnVisWeeks,
          vDayBef,
          vWeekBef,
          hol
          )
        ])
  
    print(visPred)

    #Reason for redoing all the data is because the statistics could have other effects on parking
    parkPred = parkReg.predict([
        createResData(
            monthIndex,
            dayIndex,
            mnResDOW[dayIndex],
            mdnResDOW[dayIndex],
            minResDOW[dayIndex],
            maxResDOW[dayIndex],
            mnResDays,
            mnResMonth[monthIndex],
            mdnResMonth[monthIndex],
            minResMonth[monthIndex],
            maxResMonth[monthIndex],
            mnResMonths,
            mnResWOY[woyIndex],
            mdnResWOY[woyIndex],
            minResWOY[woyIndex],
            maxResWOY[woyIndex],
            mnResWeeks,
            rDayBef,
            rWeekBef,
            visPred,
            hol
            )
          ])

    loopDate+=delta

    print(parkPred)

    output.append({'date': loopDate.strftime("%Y-%m-%d"), 'visitors': visPred[0], 'parking': parkPred[0]})

  print(time.time()-startTime)

  print(output)
  return json.dumps(output)

def train():

  startTime = time.time()

  #Global parameters
  params = { 
      "n_estimators": 600,
      "max_depth": 20,
      "min_samples_split": 4,
      "criterion": "friedman_mse",
      "learning_rate": 0.015,
      "loss": "squared_error",
      "verbose": True
  }

  #Create regressor
  visReg = ensemble.GradientBoostingRegressor(**params)
  parkReg = ensemble.GradientBoostingRegressor(**params)

  visData,resData,visOutput,resOutput = generateTrainingData()

  #Create training and test set
  X_trainVis, X_testVis, y_trainVis, y_testVis = train_test_split( visData, visOutput, test_size=0.33, shuffle=True)
  X_trainRes, X_testRes, y_trainRes, y_testRes = train_test_split( resData, resOutput, test_size=0.33, shuffle=True)

  #Train model
  visReg.fit(X_trainVis, y_trainVis)
  parkReg.fit(X_trainRes, y_trainRes)

  #Test model
  visMSE = mean_squared_error(y_testVis, visReg.predict(X_testVis))
  print("Visitor MSE:" + str(visMSE))
  parkMSE = mean_squared_error(y_testRes, parkReg.predict(X_testRes))
  print("Parking MSE:" + str(parkMSE))

  #Export model
  joblib.dump(visReg, "VMS_visitor-reg-model.pkl")
  joblib.dump(parkReg, "VMS_parking-reg-model.pkl")

  print(time.time()-startTime)

  return json.dumps({'Visitor MSE': visMSE , 'Parking MSE': parkMSE})


def visitorFeatureAnalysis():
    reg = joblib.load("VMS_visitor-reg-model.pkl")

    imp = reg.feature_importances_.tolist()
    print(imp)

    return json.dumps(imp)

def parkingFeatureAnalysis():
    reg = joblib.load("VMS_parking-reg-model.pkl")

    imp = reg.feature_importances_.tolist()
    print(imp)

    return json.dumps(imp)
