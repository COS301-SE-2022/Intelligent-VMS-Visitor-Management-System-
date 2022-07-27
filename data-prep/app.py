from app import app
from os import environ

if __name__ == "__main__":
    port = environ.get("PORT",3002)
    app.run(host="0.0.0.0",debug=False,port=port)
