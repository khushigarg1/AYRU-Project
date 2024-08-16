// "use client"
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   IconButton,
//   Modal,
//   Typography,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from '@mui/material';
// import { CloudUpload, ExpandMore, AddPhotoAlternate as AddPhotoAlternateIcon } from '@mui/icons-material';
// import api from '@/api'
// import ImagePopup from '@/src/modals/imagepopup';

// const CustomerMediaPage = () => {
//   const [mainImages, setMainImages] = useState([]);
//   const [secondaryImages, setSecondaryImages] = useState([]);
//   const [imageModalOpen, setImageModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [uploadFiles, setUploadFiles] = useState([]);


//   useEffect(() => {
//     fetchMediaImages('main');
//     fetchMediaImages('secondary');
//   }, []);

//   const fetchMediaImages = async (type) => {
//     try {
//       const response = await api.get('/customer-side-data/media', {
//         params: {
//           type: type,
//         },
//       });
//       if (type === 'main') {
//         setMainImages(response.data.data);
//       } else if (type === 'secondary') {
//         setSecondaryImages(response.data.data);
//       }
//     } catch (error) {
//       console.error(`Error fetching ${type} media images:`, error);
//     }
//   };

//   const handleOpenImageModal = (imageUrl) => {
//     setSelectedImage(imageUrl);
//     setImageModalOpen(true);
//   };

//   const handleCloseImageModal = () => {
//     setImageModalOpen(false);
//   };

//   const handleFileChange = (event) => {
//     const files = event.target.files;
//     if (!files || files.length === 0) return;
//     console.log(files);
//     setUploadFiles(files);
//   };

//   const handleUpload = async (type) => {
//     if (uploadFiles.length === 0) return

//     const formData = new FormData();
//     for (let i = 0; i < uploadFiles.length; i++) {
//       formData.append('images', uploadFiles[i]);
//     }
//     formData.append('type', type);
//     console.log("fromdata", formData);
//     try {
//       const response = await api.post('/customer-side-data/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const uploadedImages = response.data.data;
//       console.log(uploadedImages);
//       if (type === 'main') {
//         setMainImages([...mainImages, ...uploadedImages]);
//       } else if (type === 'secondary') {
//         setSecondaryImages([...secondaryImages, ...uploadedImages]);
//       }

//       setUploadFiles([]);
//     } catch (error) {
//       console.error(`Error uploading ${type} images:`, error);
//     }
//   };

//   const handleImageDelete = async (imageId, type) => {
//     try {
//       await api.delete(`/customer-side-data/media/${imageId}`);
//       if (type === 'main') {
//         setMainImages(mainImages.filter((image) => image.id !== imageId));
//       } else if (type === 'secondary') {
//         setSecondaryImages(secondaryImages.filter((image) => image.id !== imageId));
//       }
//     } catch (error) {
//       console.error(`Error deleting ${type} image:`, error);
//     }
//   };

//   return (
//     <Box>
//       <Accordion>
//         <AccordionSummary expandIcon={<ExpandMore />}>
//           <Typography>Main Section</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Box display="flex" flexDirection="column" width="100%">
//             <Typography variant="h5" gutterBottom>Main Section Media</Typography>
//             <Box mb={2}>
//               <input
//                 accept="image/*, video/*"
//                 style={{ display: 'none' }}
//                 id="main-section-file-upload"
//                 type="file"
//                 onChange={(e) => handleFileChange(e)}
//                 multiple
//               />
//               <label htmlFor="main-section-file-upload">
//                 <IconButton component="span">
//                   <AddPhotoAlternateIcon />
//                 </IconButton>
//               </label>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => handleUpload('main')}
//               >
//                 Upload
//               </Button>
//             </Box>
//             <Box display="flex" flexWrap="wrap" gap={3}>
//               {mainImages.map((image) => (
//                 <Box key={image.id} position="relative">
//                   <img
//                     src={`https://ayrujaipur.s3.amazonaws.com/${image.imageUrl}`}
//                     alt="Uploaded Image"
//                     width={100}
//                     height={100}
//                     style={{ cursor: 'pointer', borderRadius: '8px' }}
//                     onClick={() => handleOpenImageModal(`https://ayrujaipur.s3.amazonaws.com/${image?.imageUrl}`)}
//                   />
//                   <IconButton
//                     onClick={() => handleImageDelete(image.id, 'main')}
//                     sx={{
//                       width: '10px',
//                       height: '10px',
//                       position: 'absolute',
//                       top: -7,
//                       right: -7,
//                       backgroundColor: 'red',
//                       borderRadius: '50%',
//                       '&:hover': {
//                         backgroundColor: 'red',
//                         color: 'white',
//                       },
//                     }}
//                   >
//                     -
//                   </IconButton>
//                 </Box>
//               ))}
//             </Box>
//           </Box>
//         </AccordionDetails>
//       </Accordion>

//       <Accordion>
//         <AccordionSummary expandIcon={<ExpandMore />}>
//           <Typography>Secondary Section</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Box>
//             <Typography variant="h5" gutterBottom>Secondary Section Media</Typography>
//             <Box mb={2}>
//               <input
//                 accept="image/*, video/*"
//                 style={{ display: 'none' }}
//                 id="secondary-section-file-upload"
//                 type="file"
//                 onChange={(e) => handleFileChange(e)}
//                 multiple
//               />
//               <label htmlFor="secondary-section-file-upload">
//                 <IconButton component="span">
//                   <AddPhotoAlternateIcon />
//                 </IconButton>
//               </label>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => handleUpload('secondary')}
//               >
//                 Upload
//               </Button>
//             </Box>
//             <Box display="flex" flexWrap="wrap" gap={3}>
//               {secondaryImages.map((image) => (
//                 <Box key={image.id} position="relative">
//                   <img
//                     src={`https://ayrujaipur.s3.amazonaws.com/${image.imageUrl}`}
//                     alt="Uploaded Image"
//                     width={100}
//                     height={100}
//                     style={{ cursor: 'pointer', borderRadius: '8px' }}
//                     onClick={() => handleOpenImageModal(`https://ayrujaipur.s3.amazonaws.com/${image?.imageUrl}`)}
//                   />
//                   <IconButton
//                     onClick={() => handleImageDelete(image.id, 'secondary')}
//                     sx={{
//                       width: '10px',
//                       height: '10px',
//                       position: 'absolute',
//                       top: -7,
//                       right: -7,
//                       backgroundColor: 'red',
//                       borderRadius: '50%',
//                       '&:hover': {
//                         backgroundColor: 'red',
//                         color: 'white',
//                       },
//                     }}
//                   >
//                     -
//                   </IconButton>
//                 </Box>
//               ))}
//             </Box>
//           </Box>
//         </AccordionDetails>
//       </Accordion>

//       <Modal open={imageModalOpen} onClose={handleCloseImageModal}>
//         <ImagePopup imageUrl={selectedImage} onClose={handleCloseImageModal} />
//       </Modal>
//     </Box>
//   );
// };

// export default CustomerMediaPage;import React, { useState, useEffect } from 'react';

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
import api from '../../../api';
import ImagePopup from '../../modals/imagepopup';
// import ImagePopup from '@/src/modals/imagepopup';

const CustomerMediaPage = () => {
  const [mainMedia, setMainMedia] = useState([]);
  const [secondaryMedia, setSecondaryMedia] = useState([]);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);

  useEffect(() => {
    fetchMedia('main');
    fetchMedia('secondary');
  }, []);

  const fetchMedia = async (type) => {
    try {
      const response = await api.get('/customer-side-data/media', {
        params: {
          type: type,
        },
      });

      if (type === 'main') {
        setMainMedia(response.data.data);
      } else if (type === 'secondary') {
        setSecondaryMedia(response.data.data);
      }
    } catch (error) {
      console.error(`Error fetching ${type} media:`, error);
    }
  };

  const handleOpenMediaModal = (media) => {
    setSelectedMedia(media);
    setImageModalOpen(true);
  };

  const handleCloseMediaModal = () => {
    setImageModalOpen(false);
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadFiles(files);
  };

  const handleUpload = async (type) => {
    if (uploadFiles.length === 0) return;

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

      const uploadedMedia = response.data.data;
      if (type === 'main') {
        setMainMedia([...mainMedia, ...uploadedMedia]);
      } else if (type === 'secondary') {
        setSecondaryMedia([...secondaryMedia, ...uploadedMedia]);
      }

      setUploadFiles([]);
    } catch (error) {
      console.error(`Error uploading ${type} media:`, error);
    }
  };

  const handleDeleteMedia = async (mediaId, type) => {
    try {
      await api.delete(`/customer-side-data/media/${mediaId}`);
      if (type === 'main') {
        setMainMedia(mainMedia.filter(media => media.id !== mediaId));
      } else if (type === 'secondary') {
        setSecondaryMedia(secondaryMedia.filter(media => media.id !== mediaId));
      }
    } catch (error) {
      console.error(`Error deleting ${type} media:`, error);
    }
  };

  const determineMediaType = (mediaUrl) => {
    const extension = mediaUrl.split('.').pop().toLowerCase();
    if (extension === 'mp4' || extension === 'mov' || extension === 'mkv' || extension === 'webm' || extension === 'ogg' || extension === 'avi' || extension === 'wmv' || extension === 'flv' || extension === 'mpeg' || extension === 'ogv' || extension === 'swf' || extension === 'f4v') {
      return 'video';
    } else {
      return 'image';
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
                onChange={handleFileChange}
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
              {mainMedia.map((media) => (
                <Box key={media.id} position="relative">
                  {determineMediaType(media.imageUrl) === 'image' ? (
                    <img
                      src={`https://ayrujaipur.s3.amazonaws.com/${media.imageUrl}`}
                      alt="Uploaded Image"
                      width={100}
                      height={100}
                      style={{ cursor: 'pointer', borderRadius: '8px' }}
                      onClick={() => handleOpenMediaModal(`https://ayrujaipur.s3.amazonaws.com/${media?.imageUrl}`)}
                    />
                  ) : determineMediaType(media.imageUrl) === 'video' ? (
                    <video
                      controls
                      src={`${api.defaults.baseURL}media/${media.imageUrl}`}
                      width={100}
                      height={100}
                      style={{ cursor: 'pointer', borderRadius: '8px' }}
                      onClick={() => handleOpenMediaModal(media)}
                    />
                  ) : null}
                  <IconButton
                    onClick={() => handleDeleteMedia(media.id, 'main')}
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
                onChange={handleFileChange}
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
              {secondaryMedia.map((media) => (
                <Box key={media.id} position="relative">
                  {determineMediaType(media.imageUrl) === 'image' ? (
                    <img
                      src={`https://ayrujaipur.s3.amazonaws.com/${media.imageUrl}`}
                      alt="Uploaded Image"
                      width={100}
                      height={100}
                      style={{ cursor: 'pointer', borderRadius: '8px' }}
                      onClick={() => handleOpenMediaModal(`https://ayrujaipur.s3.amazonaws.com/${media?.imageUrl}`)}
                    />
                  ) : determineMediaType(media.imageUrl) === 'video' ? (
                    <video
                      controls
                      src={`https://ayrujaipur.s3.amazonaws.com/${media.imageUrl}`}
                      width={200}
                      height={150}
                      style={{ cursor: 'pointer', borderRadius: '8px' }}
                      onClick={() => handleOpenMediaModal(media)}
                    />
                  ) : null}
                  <IconButton
                    onClick={() => handleDeleteMedia(media.id, 'secondary')}
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

      {/* <Modal open={imageModalOpen} onClose={handleCloseMediaModal}>
        {selectedMedia && determineMediaType(selectedMedia.imageUrl) === 'image' && (
          <img
            src={`${api.defaults.baseURL}media/${selectedMedia.imageUrl}`}
            alt="Selected Image"
            style={{ width: '100%', height: 'auto' }}
          />
        )}
        {selectedMedia && determineMediaType(selectedMedia.imageUrl) === 'video' && (
          <video
            controls
            src={`${api.defaults.baseURL}media/${selectedMedia.imageUrl}`}
            style={{ width: '100%', height: 'auto' }}
          />
        )}
      </Modal> */}

      <Modal open={imageModalOpen} onClose={handleCloseMediaModal}>
        <ImagePopup imageUrl={selectedMedia} onClose={handleCloseMediaModal} />
      </Modal>
    </Box>
  );
};

export default CustomerMediaPage;
