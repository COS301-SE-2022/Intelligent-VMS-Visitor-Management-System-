from app import app,APP_ROOT

@app.route("/")
def home():
    return "hello world"

@app.route("/predict")
def predict():
    return "SUPER CLEVER AI DATA"
