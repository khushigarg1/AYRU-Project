import React, { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const ImageUploader = ({ onUpload }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to array
    console.log(selectedFiles);
    setFiles(selectedFiles);
  };

  const handleUpload = () => {
    if (files.length > 0) {
      onUpload(files); // Pass all selected files to onUpload
      setFiles([]); // Clear selected files after upload
    }
  };

  return (
    <div>
      <input
        accept="image/*, video/*" // Accept both images and videos
        style={{ display: 'none' }}
        id="contained-button-file"
        type="file"
        onChange={handleFileChange}
        multiple // Allow multiple file selection
      />
      <label htmlFor="contained-button-file">
        <IconButton component="span">
          <AddPhotoAlternateIcon />
        </IconButton>
      </label>
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
};

export default ImageUploader;
