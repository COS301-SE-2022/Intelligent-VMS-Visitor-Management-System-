from app import app,APP_ROOT
from flask import request
from app.fakeInviteGenerator import createInvites,resetInviteHistory

from app.model import predictMany,train,featureAnalysis

@app.route("/")
def home():
    return "hello world"

@app.route("/predict")
def predict():
    startDate = request.args.get('startDate')
    endDate = request.args.get('endDate')
    return predictMany(startDate,endDate)

@app.route("/featureAnalysis")
def fAnalysis():
    return featureAnalysis()

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
