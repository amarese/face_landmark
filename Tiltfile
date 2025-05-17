docker_build(
    'face-landmark-frontend',
    './frontend',
    dockerfile='./frontend/Dockerfile'
)

docker_build(
    'face-landmark-backend',
    './backend',
    dockerfile='./backend/Dockerfile.backend'
)

docker_compose('docker-compose.yml') 