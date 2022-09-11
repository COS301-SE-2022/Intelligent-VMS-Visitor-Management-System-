from app import app, APP_ROOT
from flask import request, redirect, url_for

from werkzeug.utils import secure_filename

def allowed_file():
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def home():
    return "facial recognition api"

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
            flash('No selected file')
            return redirect(request.url)

        # Check if file extension is allowed
        if file and allowed_file(file.filename):
            # Sanitize filename to prevent directory escalation
            filename = secure_filename(file.filename)

            # Save file in folder
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            return redirect(url_for('uploaded_file',
                                    filename=filename))

    return "Storing face"
