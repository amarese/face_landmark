# Tiltfile

# Docker Compose 설정
docker_compose('docker-compose.yml')

# 이미지 빌드 설정
docker_build(
    'face-landmark-model',
    './face_landmark_model',
    live_update=[
        sync('./face_landmark_model', '/app'),
    ]
)

docker_build(
    'face-landmark-backend',
    './face_landmark_backend',
    live_update=[
        sync('./face_landmark_backend', '/app'),
    ]
)

docker_build(
    'face-landmark-frontend',
    './face_landmark_frontend',
    live_update=[
        sync('./face_landmark_frontend', '/app'),
    ]
)
