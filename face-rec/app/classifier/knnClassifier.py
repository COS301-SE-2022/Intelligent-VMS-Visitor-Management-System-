import math
from sklearn import neighbors
import os
import os.path
import pickle

from app.database import faceEncodingsCollection
from app.faceRec.faceRecLib import getFaceEncodingsFromImage, getFacesLocationData, getLargestFace

def train(modelSavePath, numNeighbours, knnAlgo="ball_tree", verbose=False):
    encodings = []
    idOutput = []

    # Get face encoding data from database
    encodingDocuments = faceEncodingsCollection.find()    

    for encodingDoc in encodingDocuments:
        for encoding in encodingDoc["encodings"]:
            encodings.append(encoding)
            idOutput.append(encodingDoc["idNumber"])


    # Calculate number of neighbours if not provided
    if numNeighbours == None:
        numNeighbours = int(round(math.sqrt(len(X))))

    # Create KNN classifier instance with given params
    knnClf = neighbors.KNeighborsClassifier(n_neighbors=numNeighbours, algorithm=knnAlgo, weights='distance')

    # Train classifier
    knnClf.fit(encodings, idOutput)

    # Save trained model
    if modelSavePath is not None:
        with open(modelSavePath, 'wb') as f:
            pickle.dump(knnClf, f)

    return knnClf

def predict(imgData, knnClassifier, distanceThreshold=0.6):
    faceLocationData = getFacesLocationData(imgData)

    if len(faceLocationData) == 0:
        return {"error": "No faces found"}

    faceLocationData = [faceLocationData[getLargestFace(faceLocationData)]]
    encodings = getFaceEncodingsFromImage(imgData, faceLocationData)
    closestNeighbours = knnClassifier.kneighbors(encodings, n_neighbors=1)
    areMatches = [closestNeighbours[0][i][0] <= distanceThreshold for i in range(len(faceLocationData))]

    if True in areMatches:
        rec = knnClassifier.predict(encodings)
        return { "result": rec[0] }
    
    return {"error": "No face matches found"}
