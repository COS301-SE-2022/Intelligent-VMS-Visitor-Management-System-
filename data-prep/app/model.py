import joblib
from sklearn import ensemble
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from datetime import date, timedelta, datetime
from dateutil.relativedelta import relativedelta
import math

from app.database import invitesCollection,groupInvitesCollection
from app.holidaysSA import ourHolidays
from app.fakeInviteGenerator import createInvites

import json 
import joblib

start_date = date(2015,1,1)
end_date = date(2022,7,1)
current_date = end_date
features = []

#################################################################

def create_data(month,dow,mn_dow,mdn_dow,min_dow,max_dow,mn_days,mn_month,mdn_month,min_month,max_month,mn_months,mn_woy,mdn_woy,min_woy,max_woy,mn_weeks,db,wb,num_inv,prob_inv,hol):
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
      num_inv,
      prob_inv,
      hol
  ]
  return row

# MON=0 SUN=7
def calculateDaysPerDOW():
  totalDaysPerDOW = []
  endDate = date.today()

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
  endDate = date.today()

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
  endDate = date.today()

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

def calculateMeans():

    mnDOW = []
    mnWOY = []
    mnMonth = []

    visitorsPerMonth = []
    visitorsPerWOY = []
    visitorsPerDOW = []

    for i in range(7):
        visitorsPerDOW.append(0)
        mnDOW.append(0)

    for i in range(12):
        visitorsPerMonth.append(0)
        mnMonth.append(0)

    for i in range(53):
        visitorsPerWOY.append(0)
        mnWOY.append(0)

    allVisitors = list(invitesCollection.find({"inviteState": {'$ne' : "inActive"}}))
    for invite in allVisitors:
            invDate = datetime.strptime(invite['inviteDate'], '%Y-%m-%d').date()
            visitorsPerMonth[invDate.month-1]+= 1
            visitorsPerDOW[invDate.weekday()]+= 1
            visitorsPerWOY[invDate.isocalendar()[1]-1]+= 1 
    
    totalDaysPerDOW = calculateDaysPerDOW()
    totalWeeksPerWOY = calculateWeeksPerWOY()
    totalMonthsPerMonth = calculateMonthsPerMonth()

    #MN-DOW
    for i in range(7):
        if(totalDaysPerDOW[i]!=0):
            mnDOW[i] = visitorsPerDOW[i]/totalDaysPerDOW[i]

    #MN-WOY
    for i in range(53):
        if(totalWeeksPerWOY[i]!=0):
            mnWOY[i] = visitorsPerWOY[i]/totalWeeksPerWOY[i]
        
    #MN-Month
    for i in range(12):
        if(totalMonthsPerMonth[i]!=0):
            mnMonth[i] = visitorsPerMonth[i]/totalMonthsPerMonth[i]

    return mnDOW,mnWOY,mnMonth
    
def calculateRecentAverages(invDate):
    jumpYear = timedelta(days=365)

    intermed_date = invDate-jumpYear; #counting back a year
    startString= intermed_date.strftime("%Y-%m-%d")
    endString= invDate.strftime("%Y-%m-%d")

    inviteCount = invitesCollection.count_documents({ "inviteDate": {"$gt": startString, "$lt":endString}})
    mnMonths=inviteCount/12
    mnWeeks=inviteCount/52
    mnDays=inviteCount/365

    return mnDays,mnWeeks,mnMonths

def calculateMinMaxAndMedians():
  groupInvites = list(groupInvitesCollection.find())

  minDOW = []
  maxDOW = []
  mdnDOW = [] 
  minWOY = []
  maxWOY = []
  mdnWOY = []
  minMonth = []
  maxMonth = []
  mdnMonth = []

  for i in range(7):
        minDOW.append(math.inf)
        maxDOW.append(0)
        mdnDOW.append(0)

  for i in range(12):
      minMonth.append(math.inf)
      maxMonth.append(0)
      mdnMonth.append(0)
      
  for i in range(53):
      minWOY.append(math.inf)
      maxWOY.append(0)
      mdnWOY.append(0)

  for day in groupInvites:
    currDate = datetime.strptime(day['_id'], '%Y-%m-%d').date()
    if(day['numVisitors']<minDOW[currDate.weekday()]):
      minDOW[currDate.weekday()] = day['numVisitors']
    elif(day['numVisitors']>maxDOW[currDate.weekday()]):
      maxDOW[currDate.weekday()] = day['numVisitors']

    if(day['numVisitors']<minWOY[currDate.isocalendar()[1]-1]):
      minWOY[currDate.isocalendar()[1]-1] = day['numVisitors']
    elif(day['numVisitors']>maxWOY[currDate.isocalendar()[1]-1]):
      maxWOY[currDate.isocalendar()[1]-1] = day['numVisitors']

    if(day['numVisitors']<minMonth[currDate.month-1]):
      minMonth[currDate.month-1] = day['numVisitors']
    elif(day['numVisitors']>maxMonth[currDate.month-1]):
      maxMonth[currDate.month-1] = day['numVisitors']

  for i in range(7):
    mdnDOW[i] = (minDOW[i]+maxDOW[i])/2

  for i in range(12):
    mdnMonth[i]= (minMonth[i]+maxMonth[i])/2
      
  for i in range(53):
    mdnWOY[i] = (minWOY[i]+maxWOY[i])/2

  print(minDOW)
  print(maxDOW)
  print(mdnDOW)
  print(minMonth)
  print(maxMonth)
  print(mdnMonth)
  print(minWOY)
  print(maxWOY)
  print(mdnWOY)

  return minDOW,maxDOW,mdnDOW,minWOY,maxWOY,mdnWOY,minMonth,maxMonth,mdnMonth

def getNumVisitorsDayBefore(date):
  temp = groupInvitesCollection.find_one({ "_id": (date-timedelta(days=1)).strftime("%Y-%m-%d")})
  if(temp):
    return temp['numVisitors']
  else:
    return 0
  
def getNumVisitorsWeekBefore(date):
  return invitesCollection.count_documents({ "inviteDate": {'$gte': (date-timedelta(days=7)).strftime("%Y-%m-%d") , '$lt': date.strftime("%Y-%m-%d")} , "inviteState": { '$ne': "inActive" } })

def getNumProbableVisitors(numInvites):
  totalVisitors = invitesCollection.count_documents({"inviteState": { '$ne': "inActive" } })
  totalInvites = invitesCollection.count_documents({})
  return (totalVisitors/totalInvites) * numInvites 

def getNumInvites(date):
  temp = groupInvitesCollection.find_one({"_id": date.strftime("%Y-%m-%d") })
  if(temp):
    return temp['numVisitors']
  else:
    return 0

def isHoliday(date):
  if( date in ourHolidays):
    return 1
  else:
    return 0

def generateTrainingData():
  data = []
  output = []

  mnDOW,mnWOY,mnMonth = calculateMeans()
  minDOW,maxDOW,mdnDOW,minWOY,maxWOY,mdnWOY,minMonth,maxMonth,mdnMonth = calculateMinMaxAndMedians()

  totalVisitors = invitesCollection.count_documents({"inviteState": { '$ne': "inActive" } })
  totalInvites = invitesCollection.count_documents({})
  inviteActProb = totalVisitors/totalInvites

  allDays = list(groupInvitesCollection.find())
  for day in allDays:
      cDate = datetime.strptime(day['_id'], '%Y-%m-%d').date()

      mnDays,mnWeeks,mnMonths = calculateRecentAverages(cDate)

      num_inv = getNumInvites(cDate)
      day_bef =  getNumVisitorsDayBefore(cDate)
      week_bef = getNumVisitorsWeekBefore(cDate)
      prob_vis = inviteActProb*num_inv
      hol = isHoliday(cDate)
      output.append(day['numVisitors'])

      data.append(
      create_data(
          cDate.month,
          cDate.weekday(),
          mnDOW[cDate.weekday()],
          mdnDOW[cDate.weekday()],
          minDOW[cDate.weekday()],
          maxDOW[cDate.weekday()],
          mnDays,
          mnMonth[cDate.month-1],
          mdnMonth[cDate.month-1],
          minMonth[cDate.month-1],
          maxMonth[cDate.month-1],
          mnMonths,
          mnWOY[cDate.isocalendar()[1]-1],
          mdnWOY[cDate.isocalendar()[1]-1],
          minWOY[cDate.isocalendar()[1]-1],
          maxWOY[cDate.isocalendar()[1]-1],
          mnWeeks,
          day_bef,
          week_bef,
          num_inv,
          prob_vis,
          hol
          )
        )

  return data,output

##################################################################

def predictMany(startingDate,endingDate):

  reg = joblib.load("VMS_reg-model.pkl")

  startDate = datetime.strptime(startingDate, '%Y-%m-%d').date()
  endDate = datetime.strptime(endingDate, '%Y-%m-%d').date()

  #TODO (Larisa): retraining
  data = []

  mnDOW,mnWOY,mnMonth = calculateMeans()
  minDOW,maxDOW,mdnDOW,minWOY,maxWOY,mdnWOY,minMonth,maxMonth,mdnMonth = calculateMinMaxAndMedians()

  totalVisitors = invitesCollection.count_documents({"inviteState": { '$ne': "inActive" } })
  totalInvites = invitesCollection.count_documents({})
  inviteActProb = totalVisitors/totalInvites

  delta = timedelta(days=1)
  loopDate = startDate
  while loopDate <= endDate:
    mnDays,mnWeeks,mnMonths = calculateRecentAverages(loopDate)

    day_bef =  getNumVisitorsDayBefore(loopDate)
    week_bef = getNumVisitorsWeekBefore(loopDate)
    num_inv = getNumInvites(loopDate)
    prob_vis = inviteActProb * num_inv
    hol = isHoliday(loopDate)

    data.append(
        create_data(
            loopDate.month,
            loopDate.weekday(),
            mnDOW[loopDate.weekday()],
            mdnDOW[loopDate.weekday()],
            minDOW[loopDate.weekday()],
            maxDOW[loopDate.weekday()],
            mnDays,
            mnMonth[loopDate.month-1],
            mdnMonth[loopDate.month-1],
            minMonth[loopDate.month-1],
            maxMonth[loopDate.month-1],
            mnMonths,
            mnWOY[loopDate.isocalendar()[1]-1],
            mdnWOY[loopDate.isocalendar()[1]-1],
            minWOY[loopDate.isocalendar()[1]-1],
            maxWOY[loopDate.isocalendar()[1]-1],
            mnWeeks,
            day_bef,
            week_bef,
            num_inv,
            prob_vis,
            hol
            )
          )

    loopDate+=delta
  
  pred = reg.predict(data)
  print(pred)
  output = []

  loopDate = startDate
  i=0
  while loopDate <= endDate:
    output.append({'date': loopDate.strftime("%Y-%m-%d"), 'data': pred[i]})
    i+=1
    loopDate+=delta

  return json.dumps(output)

def train():

  #Global parameters
  params = { 
      "n_estimators": 500,
      "max_depth": 3,
      "min_samples_split": 5,
      "criterion": "friedman_mse",
      "learning_rate": 0.01,
      "loss": "squared_error",
  }

  #Create regressor
  reg = ensemble.GradientBoostingRegressor(**params)

  #createInvites(start_date,end_date,25)

  data,output = generateTrainingData()

  #Create training and test set
  X_train, X_test, y_train, y_test = train_test_split( data, output, test_size=0.33)

  #Train model
  reg.fit(X_train, y_train)

  #Export model
  joblib.dump(reg, "VMS_reg-model.pkl")

  #Test model
  mse = mean_squared_error(y_test, reg.predict(X_test))
  print(mse)

  return json.dumps({'MSE': mse})

def featureAnalysis():
    reg = joblib.load("VMS_reg-model.pkl")

    imp = reg.feature_importances_.tolist()
    print(imp)

    return json.dumps(imp)
