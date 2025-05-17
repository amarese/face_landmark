# Face Landmark Detection Application

This application provides a web interface for detecting face landmarks in images using OpenCV's Haar Cascade classifier.

## Prerequisites

- Docker
- Docker Compose
- Tilt

## Project Structure

```
.
├── backend/           # Backend service
│   ├── service.py    # BentoML service for face detection
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile.backend # Backend Docker configuration
├── frontend/         # React frontend application
├── res/             # Directory containing test images
├── docker-compose.yml # Docker Compose configuration
└── Tiltfile         # Tilt configuration
```

## Setup and Running

1. Install Tilt:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash
   ```

2. Start the application:
   ```bash
   tilt up
   ```

This will start both the frontend and backend services:
- Frontend: http://localhost:3001
- Backend: http://localhost:3000

## Features

- Display images from the res directory
- Face detection using OpenCV's Haar Cascade classifier
- Real-time face landmark detection
- CORS-enabled API endpoints
- Modern Material-UI based interface

## Development

The application uses Tilt for development workflow, which provides:
- Hot reloading for both frontend and backend
- Automatic rebuilds on file changes
- Easy service orchestration

## API Endpoints

- `POST /detect_landmarks`: Accepts an image and returns face detection results
  - Input: Image file
  - Output: JSON containing face detection results 