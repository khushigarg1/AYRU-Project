import React, { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Button, styled } from '@mui/material';
import api from '../../api';
import { ArrowCircleUpOutlined } from '@mui/icons-material';

const OverlayText = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: 'white',
  padding: '1px',
  borderRadius: '5px',
  textAlign: 'center',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  backgroundColor: 'transparent',
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: '90%',
  [theme.breakpoints.up('md')]: {
    width: '80%',
  },
  [theme.breakpoints.up('lg')]: {
    width: '70%',
  },
}));

const NormalText = styled('span')(({ theme }) => ({
  fontSize: '1.5rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.7rem',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '2rem',
  },
}));

const LargeText = styled('span')(({ theme }) => ({
  fontSize: '2.5rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '3rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '4rem',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '5rem',
  },
}));

const StyledButton = styled(Button)({
  backgroundColor: 'white',
  color: 'black',
  padding: '15px 30px',
  marginTop: '20px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: "1.1rem",
  borderRadius: "15px",
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '90vh',
  objectFit: 'cover',
}));

const ImageCarousel = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const type = "main";
    try {
      const response = await api.get('/customer-side-data/media', {
        params: { type },
      });
      setImages(response.data?.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return (
    <Box >
      {images.length > 0 && (
        <Carousel
          autoPlay={true}
          interval={3000}
          animation="slide"
          navButtonsAlwaysVisible={true}
          navButtonsProps={{
            style: {
              backgroundColor: 'transparent',
              borderRadius: 0
            }
          }}
          navButtonsWrapperProps={{
            style: {
              bottom: '0',
              top: 'unset'
            }
          }}
          indicators={true}
          indicatorContainerProps={{
            style: {
              position: 'absolute',
              bottom: '20px',
            }
          }}
          height="600px"
        >
          {images.map((image, index) => (
            <Box key={index} sx={{ position: 'relative', height: '100vh' }}>
              <StyledImage
                src={`${api.defaults.baseURL}image/${image.imageUrl}`}
                alt={`Slide ${index}`}
              />
              <OverlayText>
                <NormalText>Explore Handcrafted Beauty With</NormalText>
                <LargeText>AYRU JAIPUR</LargeText>
                <StyledButton>Shop Now</StyledButton>
              </OverlayText>
            </Box>
          ))}
        </Carousel>
      )}
    </Box>
  );
};

export default ImageCarousel;
