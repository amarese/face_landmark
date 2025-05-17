import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [landmarks, setLandmarks] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:3001/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLandmarks(response.data.landmarks);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to detect landmarks. Please try again.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Face Landmark Detection</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileSelect} accept="image/*" />
          <button type="submit">Detect Landmarks</button>
        </form>
        
        {error && <div className="error-message">{error}</div>}
        
        {preview && (
          <div className="preview-container">
            <img src={preview} alt="Preview" style={{ maxWidth: '500px' }} />
            {landmarks && (
              <div className="landmarks">
                {landmarks.map((landmark, index) => (
                  <div
                    key={index}
                    className="landmark-box"
                    style={{
                      position: 'absolute',
                      left: landmark.x,
                      top: landmark.y,
                      width: landmark.width,
                      height: landmark.height,
                      border: '2px solid red',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App; 