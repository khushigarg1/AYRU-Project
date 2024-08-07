import React, { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Button, styled, useMediaQuery, useTheme } from '@mui/material';
import api from '../../api';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

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
  alignItems: 'center',
  justifyContent: 'center',
  width: '80%',
  [theme.breakpoints.up('md')]: {
    width: '80%',
  },
  [theme.breakpoints.up('lg')]: {
    width: '70%',
  },
}));

const StyledButton = styled(Button)({
  fontFamily: 'Montserrat, sans-serif',
  backgroundColor: 'white',
  color: 'black',
  padding: '7px 15px',
  marginTop: '20px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: '0.7rem',
  borderRadius: '5px',
  letterSpacing: '2px',
  fontWeight: '500',
  boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

const StyledImage = styled('img')({
  width: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease-in-out',
});

const ImageCarousel = () => {
  const [images, setImages] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleShop = () => {
    router.push('/shop');
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const type = 'main';
    try {
      setLoading(true);
      const response = await api.get('/customer-side-data/media', {
        params: { type },
      });
      setImages(response.data?.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: isMobile ? 'auto' : '800px' }} mb={0}>
      {images.length > 0 && (
        <Carousel
          autoPlay
          interval={3000}
          animation="slide"
          navButtonsAlwaysVisible
          navButtonsProps={{
            style: {
              backgroundColor: 'transaprent',
              borderRadius: "50%",
              color: '#F5F5F5',
              opacity: "0.2",
            },
          }}
          navButtonsWrapperProps={{
            style: {
              // position: 'absolute',
              // width: '100%',
              // height: '100%',
              // display: 'flex',
              // justifyContent: 'space-between',
              // alignItems: 'center',
              // top: 'unset',
              // zIndex: 2,
              // '&:nth-of-type(1)': {
              // left: isMobile ? '-15px !important' : "0px",
              // marginLeft: "5px",
              // fontSize: "1px"
              // },
              // '&:nth-of-type(2)': {
              // right: isMobile ? '-15px !important' : "0px",
              // marginRight: "5px"
              // fontSize: "1px"
              // },
            },
          }}
          NextIcon={<ArrowForwardIos style={{ fontSize: '1.5rem' }} />}
          PrevIcon={<ArrowBackIos style={{ fontSize: '1.5rem' }} />}
          indicators
          indicatorContainerProps={{
            style: {
              position: 'absolute',
              bottom: '10px',
              zIndex: 1000,

            },
          }}
        >
          {images.map((image, index) => (
            <Box key={index} sx={{ position: 'relative', height: '100%' }}>
              <StyledImage
                src={`https://ayrujaipur.s3.amazonaws.com/${image.imageUrl}`}
                alt={`Slide ${index}`}
                sx={{
                  height: !isMobile && "800px"
                }}
              />
              <OverlayText style={{ top: isMobile ? '70%' : '60%' }}>
                <StyledButton style={{ fontSize: isMobile ? '0.7rem' : '1rem' }} onClick={handleShop}>
                  Shop Now
                </StyledButton>
              </OverlayText>
            </Box>
          ))}
        </Carousel>
      )
      }
    </Box >
  );
};

export default ImageCarousel;
