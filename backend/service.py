import cv2
import numpy as np
import bentoml
import os
from typing import Dict, List
from typing_extensions import TypedDict

class BBox(TypedDict):
    x: int
    y: int
    width: int
    height: int

class FaceLandmark(TypedDict):
    type: str
    bbox: BBox

class FaceLandmarkResult(TypedDict):
    faces: List[FaceLandmark]

class ImageInfo(TypedDict):
    url: str
    name: str

@bentoml.service(
    resources={"cpu": "1"},
    traffic={"timeout": 300},
    name="face_landmark_service",
    version="1.0.0",
    http={
        "port": 3000,
        "cors": {
            "enabled": True,
            "access_control_allow_origins": ["http://localhost:3001"],
            "access_control_allow_methods": ["GET", "OPTIONS", "POST"],
            "access_control_allow_credentials": True,
            "access_control_allow_headers": ["*"],
            "access_control_max_age": 1200
        }
    }
)
class FaceLandmarkService(bentoml.Service):
    def __init__(self):
        # Load the Haar Cascade classifier
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    @bentoml.api
    def list_images(self) -> List[ImageInfo]:
        """List all images in the res directory."""
        res_dir = os.path.join(os.getcwd(), 'res')
        images = []
        for filename in os.listdir(res_dir):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                images.append({
                    "url": f"/res/{filename}",
                    "name": filename
                })
        return images

    @bentoml.api
    def detect_landmarks(self, image: np.ndarray) -> FaceLandmarkResult:
        # Convert image to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        
        results = []
        for (x, y, w, h) in faces:
            face_landmarks: FaceLandmark = {
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