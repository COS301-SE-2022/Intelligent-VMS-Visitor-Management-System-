from app import app
from os import environ

if __name__ == "__main__":
    app.run(debug=False,port=environ.get("PORT", 5000))
