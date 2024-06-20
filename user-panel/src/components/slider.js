import React, { useState, useEffect } from 'react';
import { Box, Button, styled } from '@mui/material';
import api from '../../api';

const Dot = styled('div')(({ theme, active }) => ({
  height: '10px',
  width: '10px',
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[400],
  borderRadius: '50%',
  display: 'inline-block',
  margin: '0 5px',
  cursor: 'pointer',
}));

const OverlayText = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '70%',
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
  padding: '15px 40px',
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
  objectFit: 'cover',
  opacity: 1,
  height: '500px',
  [theme.breakpoints.up('sm')]: {
    height: '500px',
  },
  [theme.breakpoints.up('md')]: {
    height: '500px',
  },
  [theme.breakpoints.up('lg')]: {
    height: '800px',
  },
}));

const ImageCarousel = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [images]);

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

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <Box sx={{ marginTop: "2.5rem", width: '100%', position: 'relative', padding: "0px", overflowX: "hidden", backgroundColor: "transparent" }}>
      {images.length > 0 && (
        <Box sx={{ width: '100%', textAlign: 'center', position: 'relative' }}>
          <StyledImage
            src={`${api.defaults.baseURL}image/${images[currentIndex].imageUrl}`}
            alt={`Slide ${currentIndex}`}
          />
          <OverlayText>
            <NormalText>Explore Handcrafted Beauty With</NormalText>
            <LargeText>AYRU JAIPUR</LargeText>
            <StyledButton>Shop Now</StyledButton>
          </OverlayText>
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        {images.map((_, index) => (
          <Dot key={index} active={index === currentIndex} onClick={() => handleDotClick(index)} />
        ))}
      </Box>
    </Box>
  );
};

export default ImageCarousel;
