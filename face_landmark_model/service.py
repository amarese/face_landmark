import bentoml
import numpy as np
import cv2
import mediapipe as mp
from PIL import Image
from typing import List, Optional, Literal
from pydantic import BaseModel, Field

# MediaPipe Face Mesh 초기화
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=10,  # 최대 10개의 얼굴 감지
    min_detection_confidence=0.5
)

# Haar Cascade 초기화
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

class LandmarkPoint(BaseModel):
    x: int = Field(description="X coordinate of the landmark in pixels")
    y: int = Field(description="Y coordinate of the landmark in pixels")

class FaceLandmarkResponse(BaseModel):
    faceCount: int = Field(description="Number of faces detected")
    faces: List[List[LandmarkPoint]] = Field(description="List of faces, each containing list of landmarks")
    error: Optional[str] = Field(default=None, description="Error message if face detection failed")

def preprocess_image(image: Image.Image) -> np.ndarray:
    # PIL Image를 numpy 배열로 변환
    img_array = np.array(image)
    # RGB에서 BGR로 변환 (OpenCV는 BGR 사용)
    img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    return img_bgr

def detect_landmarks_mediapipe(img: np.ndarray) -> Optional[List[List[LandmarkPoint]]]:
    # BGR에서 RGB로 변환 (MediaPipe는 RGB 사용)
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # 얼굴 랜드마크 검출
    results = face_mesh.process(rgb_img)
    
    if not results.multi_face_landmarks:
        return None
    
    # 모든 얼굴의 랜드마크 추출
    h, w = img.shape[:2]
    all_faces = []
    
    for face_landmarks in results.multi_face_landmarks:
        face_points = []
        for landmark in face_landmarks.landmark:
            x = int(landmark.x * w)
            y = int(landmark.y * h)
            face_points.append(LandmarkPoint(x=x, y=y))
        all_faces.append(face_points)
    
    return all_faces

def detect_landmarks_haar(img: np.ndarray) -> Optional[List[List[LandmarkPoint]]]:
    # 그레이스케일로 변환
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 얼굴 검출
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30)
    )
    
    if len(faces) == 0:
        return None
    
    # 각 얼굴에 대해 5개의 주요 랜드마크 포인트 생성
    all_faces = []
    for (x, y, w, h) in faces:
        face_points = [
            LandmarkPoint(x=x + w//2, y=y + h//2),  # 코
            LandmarkPoint(x=x + w//4, y=y + h//3),  # 왼쪽 눈
            LandmarkPoint(x=x + 3*w//4, y=y + h//3),  # 오른쪽 눈
            LandmarkPoint(x=x + w//4, y=y + 2*h//3),  # 왼쪽 입
            LandmarkPoint(x=x + 3*w//4, y=y + 2*h//3)  # 오른쪽 입
        ]
        all_faces.append(face_points)
    
    return all_faces

@bentoml.service(
    name="face_landmark_service",
    api_server_config={
        "http": {
            "port": 3000
        }
    }
)
class FaceLandmarkService:
    @bentoml.api
    def predict(
        self, 
        image: Image.Image,
        model: Literal["mediapipe", "haar"] = "mediapipe"
    ) -> FaceLandmarkResponse:
        """
        Detect face landmarks using either MediaPipe Face Mesh or Haar Cascade.
        
        Args:
            image: Input image as PIL.Image
            model: Model to use for face detection ("mediapipe" or "haar")
            
        Returns:
            FaceLandmarkResponse containing list of faces and their landmark coordinates in pixels
        """
        try:
            img = preprocess_image(image)
            
            # 선택된 모델에 따라 랜드마크 감지
            if model == "mediapipe":
                faces = detect_landmarks_mediapipe(img)
            else:  # haar
                faces = detect_landmarks_haar(img)
            
            if faces is None:
                return FaceLandmarkResponse(
                    faceCount=0,
                    faces=[],
                    error="No face detected"
                )
            
            return FaceLandmarkResponse(
                faceCount=len(faces),
                faces=faces
            )
            
        except Exception as e:
            return FaceLandmarkResponse(
                faceCount=0,
                faces=[],
                error=str(e)
            )
