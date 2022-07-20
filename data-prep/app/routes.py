from app import app,APP_ROOT

from app.model import predictMany,train,featureAnalysis

@app.route("/")
def home():
    return "hello world"

@app.route("/predict")
def predict(startDate,endDate):
    return predictMany(startDate,endDate)

@app.route("/featureAnalysis")
def fAnalysis():
    return featureAnalysis()

@app.route("/train")
def training():
    return train()

