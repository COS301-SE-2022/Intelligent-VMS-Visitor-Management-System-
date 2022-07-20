from app import app,APP_ROOT

from app.model import hello

@app.route("/")
def home():
    return "hello world"

@app.route("/predict")
def predict():
    return "SUPER CLEVER AI DATA"

@app.route("/featureAnalysis")
def featureAnalysis():
    ms = hello
    return ms

@app.route("/mse")
def mse():
    return "SUPER CLEVER AI DATA"

