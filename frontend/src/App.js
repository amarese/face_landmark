import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch images from the backend using POST
    axios.post('http://localhost:3000/list_images')
      .then(response => {
        setImages(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load images');
        setLoading(false);
      });
  }, []);

  const detectFaces = async (imageUrl) => {
    try {
      const response = await axios.post('http://localhost:3000/detect_landmarks', {
        image: imageUrl
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error detecting faces:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Face Landmark Detection
      </Typography>
      <Grid container spacing={4}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={`http://localhost:3000${image.url}`}
                alt={image.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {image.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {image.faces ? `${image.faces.length} faces detected` : 'No faces detected'}
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