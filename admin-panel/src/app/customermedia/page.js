"use client"
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { CloudUpload, ExpandMore, AddPhotoAlternate as AddPhotoAlternateIcon } from '@mui/icons-material';
import api from '@/api'; // Replace with your API module
import ImagePopup from '@/src/modals/imagepopup';

const CustomerMediaPage = () => {
  const [mainImages, setMainImages] = useState([]);
  const [secondaryImages, setSecondaryImages] = useState([]);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]); // State to hold selected files

  useEffect(() => {
    fetchMediaImages('main');
    fetchMediaImages('secondary');
  }, []);

  const fetchMediaImages = async (type) => {
    try {
      const response = await api.get('/customer-side-data/media', {
        params: {
          type: type,
        },
      });
      if (type === 'main') {
        setMainImages(response.data.data);
      } else if (type === 'secondary') {
        setSecondaryImages(response.data.data);
      }
    } catch (error) {
      console.error(`Error fetching ${type} media images:`, error);
    }
  };

  const handleOpenImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Store selected files in state
    setUploadFiles(files);
  };

  const handleUpload = async (type) => {
    if (uploadFiles.length === 0) return; // Exit if no files selected

    const formData = new FormData();
    for (let i = 0; i < uploadFiles.length; i++) {
      formData.append('images', uploadFiles[i]);
    }
    formData.append('type', type);

    try {
      const response = await api.post('/customer-side-data/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedImages = response.data.data;
      if (type === 'main') {
        setMainImages([...mainImages, ...uploadedImages]);
      } else if (type === 'secondary') {
        setSecondaryImages([...secondaryImages, ...uploadedImages]);
      }

      // Clear selected files after successful upload
      setUploadFiles([]);
    } catch (error) {
      console.error(`Error uploading ${type} images:`, error);
    }
  };

  const handleImageDelete = async (imageId, type) => {
    try {
      await api.delete(`/customer-side-data/media/${imageId}`);
      if (type === 'main') {
        setMainImages(mainImages.filter((image) => image.id !== imageId));
      } else if (type === 'secondary') {
        setSecondaryImages(secondaryImages.filter((image) => image.id !== imageId));
      }
    } catch (error) {
      console.error(`Error deleting ${type} image:`, error);
    }
  };

  return (
    <Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Main Section</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" width="100%">
            <Typography variant="h5" gutterBottom>Main Section Media</Typography>
            <Box mb={2}>
              <input
                accept="image/*, video/*"
                style={{ display: 'none' }}
                id="main-section-file-upload"
                type="file"
                onChange={(e) => handleFileChange(e)}
                multiple
              />
              <label htmlFor="main-section-file-upload">
                <IconButton component="span">
                  <AddPhotoAlternateIcon />
                </IconButton>
              </label>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleUpload('main')}
              >
                Upload
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={3}>
              {mainImages.map((image) => (
                <Box key={image.id} position="relative">
                  <img
                    src={`${api.defaults.baseURL}image/${image.imageUrl}`}
                    alt="Uploaded Image"
                    width={100}
                    height={100}
                    style={{ cursor: 'pointer', borderRadius: '8px' }}
                    onClick={() => handleOpenImageModal(`${api.defaults.baseURL}image/${image?.imageUrl}`)}
                  />
                  <IconButton
                    onClick={() => handleImageDelete(image.id, 'main')}
                    sx={{
                      width: '10px',
                      height: '10px',
                      position: 'absolute',
                      top: -7,
                      right: -7,
                      backgroundColor: 'red',
                      borderRadius: '50%',
                      '&:hover': {
                        backgroundColor: 'red',
                        color: 'white',
                      },
                    }}
                  >
                    -
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Secondary Section</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="h5" gutterBottom>Secondary Section Media</Typography>
            <Box mb={2}>
              <input
                accept="image/*, video/*"
                style={{ display: 'none' }}
                id="secondary-section-file-upload"
                type="file"
                onChange={(e) => handleFileChange(e)}
                multiple
              />
              <label htmlFor="secondary-section-file-upload">
                <IconButton component="span">
                  <AddPhotoAlternateIcon />
                </IconButton>
              </label>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleUpload('secondary')}
              >
                Upload
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={3}>
              {secondaryImages.map((image) => (
                <Box key={image.id} position="relative">
                  <img
                    src={`${api.defaults.baseURL}image/${image.imageUrl}`}
                    alt="Uploaded Image"
                    width={100}
                    height={100}
                    style={{ cursor: 'pointer', borderRadius: '8px' }}
                    onClick={() => handleOpenImageModal(`${api.defaults.baseURL}image/${image?.imageUrl}`)}
                  />
                  <IconButton
                    onClick={() => handleImageDelete(image.id, 'secondary')}
                    sx={{
                      width: '10px',
                      height: '10px',
                      position: 'absolute',
                      top: -7,
                      right: -7,
                      backgroundColor: 'red',
                      borderRadius: '50%',
                      '&:hover': {
                        backgroundColor: 'red',
                        color: 'white',
                      },
                    }}
                  >
                    -
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Modal open={imageModalOpen} onClose={handleCloseImageModal}>
        <ImagePopup imageUrl={selectedImage} onClose={handleCloseImageModal} />
      </Modal>
    </Box>
  );
};

export default CustomerMediaPage;
