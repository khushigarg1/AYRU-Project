import React, { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Button, styled, useMediaQuery, useTheme } from '@mui/material';
import api from '../../api';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const OverlayText = styled('div')(({ theme }) => ({
  position: 'absolute',
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
  alignItems: "center",
  justifyContent: "center",
  width: '80%',
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
  fontFamily: "Montserrat, sans-serif",
  backgroundColor: 'white',
  color: 'black',
  padding: '7px 15px',
  marginTop: '20px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: "0.7rem",
  borderRadius: "5px",
  letterSpacing: "2px",
  fontWeight: "500",
  boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)",
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '80vh',
  objectFit: 'cover',
  transition: 'transform 0.5s ease-in-out',
}));

const ImageCarousel = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Box>
      {images.length > 0 && (
        <Carousel
          autoPlay={true}
          interval={3000}
          animation="slide"
          navButtonsAlwaysVisible={true}
          navButtonsProps={{
            style: {
              backgroundColor: 'transparent',
              borderRadius: 0,
              color: '#F5F5F5',
              opacity: "0.5"
            }
          }}
          navButtonsWrapperProps={{
            style: {
              bottom: '0',
              top: 'unset',
              zIndex: 2,
              '&:nth-of-type(1)': {
                left: isMobile ? '-15px !important' : "0px",
                marginLeft: "5px"
              },
              '&:nth-of-type(2)': {
                right: isMobile ? '-15px !important' : "0px",
                marginRight: "5px"
              },
            }
          }}
          NextIcon={<ArrowForwardIos />}
          PrevIcon={<ArrowBackIos />}
          indicators={true}
          indicatorContainerProps={{
            style: {
              position: 'absolute',
              bottom: '20px',
            }
          }}
          height={isMobile ? "600px" : "800px"}
        >
          {images.map((image, index) => (
            <Box key={index} sx={{ position: 'relative', height: '100vh' }}>
              <StyledImage
                src={`https://ayrujaipur.s3.amazonaws.com/${image.imageUrl}`}
                alt={`Slide ${index}`}
                style={{ transform: `translateX(${currentIndex * -100}%)`, height: isMobile ? "90%" : "120%", objectFit: "contain" }}
              />
              <OverlayText style={{ top: isMobile ? "70%" : "60%", fontSize: "1.2rem" }}>
                <StyledButton style={{ fontSize: isMobile ? "0.7rem" : "1rem" }}>Shop Now</StyledButton>
              </OverlayText>
            </Box>
          ))}
        </Carousel>
      )}
    </Box>
  );
};

export default ImageCarousel;
