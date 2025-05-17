# Load docker-compose configuration
docker_compose('docker-compose.yml')

# Enable hot reloading for Python service
docker_build(
    'face_landmark_python',
    '.',
    dockerfile='Dockerfile.python',
    live_update=[
        sync('.', '/app'),
        run('pip install -r requirements.txt'),
    ]
)

# Enable hot reloading for React frontend
docker_build(
    'face_landmark_react',
    './frontend',
    dockerfile='./frontend/Dockerfile',
    live_update=[
        sync('./frontend', '/app'),
        run('npm install'),
    ]
) 