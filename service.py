import bentoml
import numpy as np
import cv2
from bentoml.io import JSON, Image

# Face landmark detection service
svc = bentoml.Service("face_landmark_service")

@svc.api(
    input=Image(),
    output=JSON(),
    route="/predict",
    cors=True,
    cors_origins=["http://localhost:3002"],
    cors_methods=["GET", "POST", "OPTIONS"],
    cors_headers=["Content-Type"],
    cors_max_age=3600
)
def detect_landmarks(img):
    # Convert image to numpy array
    img_array = np.array(img)
    
    # Convert to grayscale for face detection
    gray = cv2.cvtColor(img_array, cv2.COLOR_BGR2GRAY)
    
    # Load face detector
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    # Detect faces
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    
    # For now, return dummy landmarks
    landmarks = []
    for (x, y, w, h) in faces:
        landmarks.append({
            "x": int(x),
            "y": int(y),
            "width": int(w),
            "height": int(h)
        })
    
    return {"landmarks": landmarks} 