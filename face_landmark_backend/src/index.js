const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;
const MODEL_SERVER_URL = process.env.MODEL_SERVER_URL || 'http://localhost:3000';

// 로깅 미들웨어 추가
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

// 정적 파일 서빙 설정
app.use('/res', express.static(path.join(__dirname, '../../res')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../res');
    // 디렉토리가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Get list of images
app.get('/api/images', (req, res) => {
  const resDir = path.join(__dirname, '../../res');
  console.log('Reading directory:', resDir);
  fs.readdir(resDir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).json({ error: 'Failed to read images directory' });
    }
    const images = files.filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    console.log('Found images:', images);
    res.json(images);
  });
});

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }
  console.log('File uploaded:', req.file.filename);
  res.json({ filename: req.file.filename });
});

// Get face landmarks for an image
app.get('/api/landmarks/:filename', async (req, res) => {
  try {
    const model = req.query.model || 'mediapipe'; // 기본값은 mediapipe
    console.log('Getting landmarks for:', req.params.filename, 'using model:', model);
    const imagePath = path.join(__dirname, '../../res', req.params.filename);
    
    // 이미지 파일을 바이너리로 읽기
    const imageBuffer = fs.readFileSync(imagePath);
    
    // FormData 생성
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: req.params.filename,
      contentType: 'image/jpeg'  // 또는 적절한 이미지 타입
    });
    formData.append('model', model);

    console.log('Sending request to model server:', MODEL_SERVER_URL);
    const response = await axios.post(`${MODEL_SERVER_URL}/predict`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    console.log('Received response from model server');
    res.json(response.data);
  } catch (error) {
    console.error('Error getting landmarks:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to get face landmarks' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
  console.log(`Model server URL: ${MODEL_SERVER_URL}`);
}); 