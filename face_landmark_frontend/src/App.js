import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Switch,
  Box
} from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function App() {
  const [images, setImages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('mediapipe');
  const [showOverlay, setShowOverlay] = useState(true);
  const [landmarks, setLandmarks] = useState({});

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/images`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const fetchLandmarks = async (filename) => {
    try {
      const response = await axios.get(`${API_URL}/api/landmarks/${filename}?model=${selectedModel}`);
      setLandmarks(prev => ({
        ...prev,
        [filename]: response.data
      }));
    } catch (error) {
      console.error('Error fetching landmarks:', error);
    }
  };

  const drawLandmarks = (canvas, image, filename) => {
    if (!landmarks[filename]) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const { faces } = landmarks[filename];
      
      // 모델에 따라 색상 설정
      ctx.strokeStyle = selectedModel === 'mediapipe' ? '#00ff00' : '#ff0000';
      ctx.fillStyle = selectedModel === 'mediapipe' ? '#00ff00' : '#ff0000';
      ctx.lineWidth = 2;

      // 각 얼굴의 랜드마크 그리기
      faces.forEach(face => {
        face.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
          ctx.fill();
        });
      });
    };
  };

  // 모델이 변경될 때마다 모든 이미지의 랜드마크를 다시 가져오기
  useEffect(() => {
    Object.keys(landmarks).forEach(filename => {
      fetchLandmarks(filename);
    });
  }, [selectedModel]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <FormControl component="fieldset">
          <Typography variant="h6" gutterBottom>
            Model Selection
          </Typography>
          <RadioGroup
            row
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <FormControlLabel value="mediapipe" control={<Radio />} label="MediaPipe" />
            <FormControlLabel value="haar" control={<Radio />} label="Haar Cascade" />
          </RadioGroup>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={showOverlay}
              onChange={(e) => setShowOverlay(e.target.checked)}
            />
          }
          label="Show Overlay"
        />
      </Box>

      <Grid container spacing={3}>
        {images.map((filename) => (
          <Grid item xs={12} sm={6} md={4} key={filename}>
            <Card>
              <CardMedia
                component="div"
                sx={{ position: 'relative', height: 300 }}
              >
                <img
                  src={`${API_URL}/res/${filename}`}
                  alt={filename}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onClick={() => fetchLandmarks(filename)}
                />
                {showOverlay && landmarks[filename] && (
                  <canvas
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                    ref={(canvas) => {
                      if (canvas) {
                        drawLandmarks(
                          canvas,
                          `${API_URL}/res/${filename}`,
                          filename
                        );
                      }
                    }}
                  />
                )}
              </CardMedia>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {filename}
                  {landmarks[filename] && (
                    <span> - {landmarks[filename].faceCount} faces detected</span>
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App; 