from app import app, APP_ROOT, ALLOWED_EXTENSIONS
from flask import request, redirect, url_for
from werkzeug.utils import secure_filename
import json

from app.faceRec.faceRecLib import loadImage, faceRecognition, init

# init()

# Parse filename to check if it is valid
def allowedFile(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def createResponse(data):
    return app.response_class(
        response = json.dumps(data),
        status = 200,
        mimetype = 'application/json'
    )

# Endpoint check
@app.route("/")
def home():
    return "facial recognition api"

# Store face encoding
@app.route("/storeFace", methods=['POST'])
def storeFace():
    if request.method == "POST":

        # Check if file is in request
        if 'file' not in request.files:
            flash('No file in request')
            return redirect(request.url)

        # Get file data from request
        file = request.files['file']

        # Check if file is selected
        if file.filename == '':
            abort(400)
            return redirect(request.url)

        # Check if file extension is allowed
        if file and allowedFile(file.filename):
            # Sanitize filename to prevent directory escalation
            filename = secure_filename(file.filename)
            
            image = loadImage(file)
            data = faceRecognition(image, "kyle")
            print("Result: {}".format(data))

            return createResponse({"result": data})
        
        return createResponse({"error": "Invalid File"})
