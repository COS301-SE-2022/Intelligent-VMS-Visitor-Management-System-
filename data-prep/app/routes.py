from app import app,APP_ROOT
from flask import request
from app.fakeInviteGenerator import createInvites,resetInviteHistory

from app.model import predictMany,train,visitorFeatureAnalysis,parkingFeatureAnalysis,createPredictionCache,getCachedValues
from threading import Thread
import json

def predictManyCache(startDate, endDate):
    createPredictionCache(startDate, endDate)

@app.route("/")
def home():
    return "hello world"

@app.route("/predict")
def predict():
    startDate = request.args.get('startDate')
    endDate = request.args.get('endDate')
    return json.dumps(predictMany(startDate,endDate))

@app.route("/predictAsync")
def predictAsync():
    startDate = request.args.get('startDate')
    endDate = request.args.get('endDate')
    workerThread = Thread(target=predictManyCache, args=(startDate, endDate))
    workerThread.start()
    return "done"

@app.route("/trainAsync")
def trainAsync():
    workerThread = Thread(target=train)
    workerThread.start()
    return "done"

@app.route("/getCache")
def getCache():
    startDate = request.args.get('startDate')
    endDate = request.args.get('endDate')
    return json.dumps(getCachedValues(startDate, endDate))

@app.route("/visitorFeatureAnalysis")
def vFeatureAnalysis():
    return visitorFeatureAnalysis()

@app.route("/parkingFeatureAnalysis")
def pFeatureAnalysis():
    return parkingFeatureAnalysis()

@app.route("/train")
def training():
    return train()

@app.route("/generateFakeInvites")
def generate():
    startDate = request.args.get('startDate')
    endDate = request.args.get('endDate')
    numRes = request.args.get('numResidents')
    createInvites(startDate,endDate,int(numRes))
    return "finished"

@app.route("/resetDB")
def reset():
    resetInviteHistory()
    return "finished"
