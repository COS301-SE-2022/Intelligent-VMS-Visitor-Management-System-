from tokenize import group
import joblib
from sklearn import ensemble
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from datetime import date, timedelta, datetime
from dateutil.relativedelta import relativedelta
import math
import numpy as np

from app.database import invitesCollection,groupInvitesCollection,parkingReservationCollection,groupParkingReservationsCollection
from app.holidaysSA import ourHolidays

import json 
import joblib
import time

global start_date
visReg = joblib.load("VMS_visitor-reg-model.pkl")
parkReg = joblib.load("VMS_parking-reg-model.pkl")

allGroupInvites = groupInvitesCollection.find()
allGroupParking = groupParkingReservationsCollection.find()

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

  # print("Total Days Per Day of Week")
  # print(totalDaysPerDOW)
  # print()

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

  # print("Total Weeks Per Week of the Year")
  # print(totalWeeksPerWOY)
  # print()

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

  # print("Total Months per Month")
  # print(totalMonthsPerMonth)
  # print()

  return totalMonthsPerMonth

##################################################Calculations

def calculateMeans():

    mnVisDOW = [0]*7
    mnVisWOY = [0]*53
    mnVisMonth = [0]*12

    mnResDOW = [0]*7
    mnResWOY = [0]*53
    mnResMonth = [0]*12

    visitorsPerDOW = [0]*7
    visitorsPerWOY = [0]*53
    visitorsPerMonth = [0]*12

    resPerDOW = [0]*7
    resPerWOY = [0]*53
    resPerMonth = [0]*12

    groupInvites = list(groupInvitesCollection.find({"_id": {'$lt' : date.today().strftime("%Y-%m-%d") }}))
    for group in groupInvites:
      numVis = group['numVisitors']
      currDate = datetime.strptime(group['_id'], '%Y-%m-%d').date()

      visitorsPerMonth[currDate.month-1]+= numVis
      visitorsPerDOW[currDate.weekday()]+= numVis
      visitorsPerWOY[currDate.isocalendar()[1]-1]+=numVis

    groupReservations = list(groupParkingReservationsCollection.find({"_id": {'$lt' : date.today().strftime("%Y-%m-%d") }}))
    for group in groupReservations:
      numParkings = group['numParkings']
      currDate = datetime.strptime(group['_id'], '%Y-%m-%d').date()

      resPerMonth[currDate.month-1]+= numParkings
      resPerDOW[currDate.weekday()]+= numParkings
      resPerWOY[currDate.isocalendar()[1]-1]+= numParkings

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

#############numpy
def calculateVisitorMinMaxAndMedians():
  groupInvites = list(allGroupInvites)

  temp = []
  for day in groupInvites:
      temp.append(day["numInvites"])

  return np.min(np.array(temp)),np.max(np.array(temp)),np.median(np.array(temp))

def calculateParkingMinMaxAndMedians():
  groupParking = list(allGroupParking)

  temp = []
  for day in groupParking:
      temp.append(day["numParking"])

  return np.min(np.array(temp)),np.max(np.array(temp)),np.median(np.array(temp))
  
##################

def calculateMinMaxAndMedians():
  groupInvites = list(groupInvitesCollection.find())
  groupReservations = list(groupParkingReservationsCollection.find())

  minVisDOW = [0]*7
  maxVisDOW = [0]*7
  mdnVisDOW = [0]*7

  minVisWOY = [0]*53
  maxVisWOY = [0]*53
  mdnVisWOY = [0]*53

  minVisMonth = [0]*12
  maxVisMonth = [0]*12
  mdnVisMonth = [0]*12


  minResDOW = [0]*7
  maxResDOW = [0]*7
  mdnResDOW = [0]*7

  minResWOY = [0]*53
  maxResWOY = [0]*53
  mdnResWOY = [0]*53

  minResMonth = [0]*12
  maxResMonth = [0]*12
  mdnResMonth = [0]*12

  for day in groupReservations:
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
      "n_estimators": 100,
      "max_depth": 3,
      "min_samples_split": 2,
      "criterion": "friedman_mse",
      "learning_rate": 0.1,
      "loss": "quantile",
      "alpha": 0.5,
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

    imp = visReg.feature_importances_.tolist()
    print(imp)

    return json.dumps(imp)

def parkingFeatureAnalysis():

    imp = parkReg.feature_importances_.tolist()
    print(imp)

    return json.dumps(imp)
