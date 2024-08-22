import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, CardMedia, IconButton, Modal, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import api from '../../api';
import ImagePopup from '@/modals/imagepopup';

const ClientLoveSlider = () => {
  const [clientLoves, setClientLoves] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    fetchClientLoves();
  }, []);

  const fetchClientLoves = async () => {
    try {
      const response = await api.get('/clientLoves');
      setClientLoves(response.data?.data);
    } catch (error) {
      console.error('Error fetching client loves:', error);
    }
  };

  const handleOpenImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 300; // Adjust the scroll amount as needed
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 300; // Adjust the scroll amount as needed
    }
  };

  return (
    <>
      <Paper>
        <Box sx={{ width: "auto", margin: "0 auto", marginTop: "4%", marginBottom: "25px" }}>
          <Box style={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center' }} pt={2}>
            <Typography variant={isMobile ? 'h4' : 'h3'} sx={{ mb: 4, color: theme.palette.text.text }}>
              Client Love
            </Typography>
          </Box>

          <Box sx={{ position: 'relative' }}>
            {!isMobile && (
              <>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '2px',
                    transform: 'translateY(-50%)',
                    zIndex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.4)", '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    },
                    color: "white",
                    width: "30px",
                    height: "30px",
                    paddingLeft: "12px"
                  }} onClick={scrollLeft}
                >
                  <ArrowBackIos fontSize='10px' style={{ width: "15px", height: "15px" }} />
                </IconButton>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: '2px',
                    transform: 'translateY(-50%)',
                    zIndex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    },
                    color: "white",
                    width: "30px",
                    height: "30px"
                  }}
                  onClick={scrollRight}
                >
                  <ArrowForwardIos fontSize='10px' style={{ width: "15px", height: "15px" }} />
                </IconButton>
              </>
            )}

            <Box
              ref={sliderRef}
              sx={{
                display: 'flex',
                overflowX: 'auto',
                paddingBottom: '10px',
                scrollBehavior: 'smooth',
                "&::-webkit-scrollbar": {
                  height: '4px',
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '10px',
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: theme.palette.background.default,
                  borderRadius: '10px',
                },
              }}
            >
              {clientLoves.map((item, idx) => (
                <Card
                  key={idx}
                  sx={{
                    minWidth: isMobile ? "70%" : "calc(100% / 5.5)",
                    boxShadow: "none",
                    flex: "0 0 auto",
                    margin: "0 10px",
                    // borderRadius: "15px",
                  }}
                >
                  <Box sx={{ position: 'relative', flexGrow: 1 }}>
                    <CardMedia
                      component="img"
                      image={`https://ayrujaipur.s3.amazonaws.com/${item.imageUrl}`}
                      onClick={() => handleOpenImageModal(`https://ayrujaipur.s3.amazonaws.com/${item?.imageUrl}`)}
                      alt={`Slide ${idx}`}
                      sx={{
                        objectFit: 'fit',
                        width: '260px',
                        height: '350px',
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      textAlign: 'center',
                      padding: "10px",
                      width: "260px"
                    }}
                  >
                    <Typography
                      variant="body1"
                      component="div"
                      sx={{
                        wordBreak: 'break-word',   // Allows the text to break and wrap onto the next line
                        whiteSpace: 'normal',      // Ensures that the text wraps naturally
                      }}
                    >
                      {item?.text}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      <Modal open={imageModalOpen} onClose={handleCloseImageModal}>
        <ImagePopup imageUrl={selectedImage} onClose={handleCloseImageModal} />
      </Modal>
    </>
  );
};

export default ClientLoveSlider;
