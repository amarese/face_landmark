# Face Landmark Detection Web Application

얼굴 이미지에서 랜드마크를 검출하고 웹 인터페이스를 통해 시각화하는 애플리케이션입니다.

## 기술 스택

- Backend: Python, BentoML, OpenCV
- Frontend: React
- Development: Tilt, Docker, Docker Compose

## 프로젝트 구조

```
.
├── service.py              # BentoML 서비스 정의
├── requirements.txt        # Python 의존성
├── Dockerfile.python      # Python 서비스 Dockerfile
├── frontend/              # React 프론트엔드
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml     # Docker Compose 설정
```

## 기능

- 이미지 업로드 및 미리보기
- 얼굴 검출 및 랜드마크 표시
- 실시간 개발 환경 (Hot Reloading)

## 시작하기

### 필수 요구사항

- Docker
- Docker Compose
- Tilt

### 설치 및 실행

1. Tilt 설치 (macOS):
```bash
brew install tilt-dev/tap/tilt
```

2. 프로젝트 실행:
```bash
tilt up
```

### 접근 방법

- React 프론트엔드: http://localhost:3002
- Python API 서버: http://localhost:3001

## 개발 환경

### Hot Reloading

- Python 서비스: service.py 또는 requirements.txt 변경 시 자동 재시작
- React 프론트엔드: 소스 코드 변경 시 자동 재시작

### 볼륨 마운트

- Python 서비스:
  - service.py
  - requirements.txt

- React 프론트엔드:
  - src/
  - public/
  - package.json
  - package-lock.json

## API 엔드포인트

### 얼굴 랜드마크 검출

- URL: `/predict`
- Method: POST
- Content-Type: multipart/form-data
- Request Body: 이미지 파일
- Response: 검출된 얼굴 랜드마크 좌표

## 문제 해결

### CORS 이슈

현재 BentoML의 CORS 설정이 불안정할 수 있습니다. 다음과 같은 대안을 고려할 수 있습니다:

1. Nginx를 리버스 프록시로 사용
2. BentoML의 CORS 설정을 환경 변수로 구성
3. 프론트엔드에서 프록시 설정

## 라이선스

MIT License 