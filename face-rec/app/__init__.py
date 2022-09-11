from flask import Flask
import os

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
# FACES_FOLDER = '../Faces'
ALLOWED_EXTENSIONS = set(['jpg', 'jpeg'])

app = Flask(__name__)
# app.config['FACES_FOLDER'] = UPLOAD_FOLDER

from app import routes
