import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setUploadStatus('');
      setUploadProgress(0);
    } else {
      setUploadStatus('Please select a valid video file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedFile);

    try {
      setUploadStatus('Uploading...');
      
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      if (response.ok) {
        setUploadStatus('Upload successful!');
      } else {
        setUploadStatus('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Upload failed. Please try again.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Video Upload App</h1>
      </header>
      <main className="App-main">
        <div className="upload-container">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="file-input"
          />
          
          {preview && (
            <div className="video-preview">
              <video src={preview} controls width="400">
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          
          {selectedFile && (
            <div className="upload-details">
              <p>Selected file: {selectedFile.name}</p>
              <p>File size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              <button onClick={handleUpload} className="upload-button">
                Upload Video
              </button>
            </div>
          )}
          
          {uploadProgress > 0 && (
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span>{uploadProgress}%</span>
            </div>
          )}
          
          {uploadStatus && (
            <p className={`status-message ${
              uploadStatus.includes('successful') ? 'success' : 
              uploadStatus.includes('failed') ? 'error' : ''
            }`}> 
              {uploadStatus}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;