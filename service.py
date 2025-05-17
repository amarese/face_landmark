import cv2
import numpy as np
import bentoml
from bentoml.io import JSON, Image
from bentoml.adapters import FileInput
from bentoml.frameworks.cv2 import OpenCvImage

@bentoml.service(
    resources={"cpu": "1"},
    traffic={"timeout": 300},
    name="face_landmark_service",
    version="1.0.0",
)
class FaceLandmarkService(bentoml.Service):
    def __init__(self):
        # Load the Haar Cascade classifier
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    @bentoml.api(input=Image(), output=JSON())
    def detect_landmarks(self, image: OpenCvImage) -> dict:
        # Convert image to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        
        results = []
        for (x, y, w, h) in faces:
            face_landmarks = {
                "type": "haar_cascade",
                "bbox": {
                    "x": int(x),
                    "y": int(y),
                    "width": int(w),
                    "height": int(h)
                }
            }
            results.append(face_landmarks)
            
        return {"faces": results} 