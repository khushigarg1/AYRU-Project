import React, { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Button, styled, useMediaQuery, useTheme } from '@mui/material';
import api from '../../api';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

import Laptop1 from "../../public/images/slider/laptop1.PNG";
import Laptop2 from "../../public/images/slider/laptop2.PNG";
import Laptop3 from "../../public/images/slider/laptop3.PNG";
import Laptop4 from "../../public/images/slider/laptop4.PNG";
import Mobile1 from "../../public/images/slider/mobile1.PNG";
import Mobile2 from "../../public/images/slider/mobile2.PNG";
import Mobile3 from "../../public/images/slider/mobile3.PNG";
import Mobile4 from "../../public/images/slider/mobile4.PNG";
import Mobile5 from "../../public/images/slider/mobile5.PNG";
import Image from 'next/image';

// Images for each device type
const mobileImages = [Mobile1, Mobile2, Mobile3, Mobile4, Mobile5];
const tabletImages = [Mobile1, Mobile2, Mobile3, Mobile4, Mobile5];
const laptopImages = [Laptop1, Laptop2, Laptop3, Laptop4];

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

const StyledButton = styled(Button)(({ theme }) => ({
  fontFamily: 'Montserrat, sans-serif',
  backgroundColor: theme.palette.background.primary,
  // backgroundColor: 'white',
  color: 'black',
  padding: '7px 15px',
  marginTop: '25px',
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
}));

const StyledImage = styled('img')({
  width: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease-in-out',
});

const ImageCarousel = () => {
  const [images, setImages] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLaptop = useMediaQuery(theme.breakpoints.up('md'));

  const displayImages = isMobile ? mobileImages : isTablet ? tabletImages : laptopImages;

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleShop = () => {
    router.push('/shop');
  };

  // useEffect(() => {
  //   fetchImages();
  // }, []);

  // const fetchImages = async () => {
  //   const type = 'main';
  //   try {
  //     setLoading(true);
  //     const response = await api.get('/customer-side-data/media', {
  //       params: { type },
  //     });
  //     setImages(response.data?.data);
  //   } catch (error) {
  //     console.error('Error fetching images:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Box sx={{
      position: 'relative', width: '100%',
      // backgroundColor: theme.palette.background.paper
    }} mb={0}
      p={isMobile ? 0 : 4}
    >
      {/* {displayImages.length > 0 && ( */}
      <Carousel
        autoPlay
        interval={2000}
        animation="slide"
        navButtonsProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            color: "white",
            borderRadius: "50%",
            display: isMobile && "none"
          },
        }}
        navButtonsAlwaysVisible
        stopAutoPlayOnHover={false}
        indicators
        indicatorContainerProps={{
          style: {
            position: 'absolute',
            bottom: '10px',
            zIndex: 1000,
            display: isMobile && "none"
          },
        }}
      >
        {displayImages.map((image, index) => (
          // <Box key={index} sx={{ position: 'relative', height: '100%' }}>
          <>
            <Image
              src={image}
              alt={`Slide ${index}`}
              // fill
              style={{
                width: '100%',
                // objectFit: 'fit',
                // objectFit: "contain",
                objectFit: isMobile ? "cover" : "contain",
                // objectFit: !isLaptop ? "cover" : "fit",
                transition: 'transform 0.5s ease-in-out',
                maxHeight: isMobile ? "475px" : "550px"
              }}
            />
            <OverlayText style={{ top: isMobile ? '70%' : '60%' }}>
              <StyledButton style={{ fontSize: isMobile ? '0.7rem' : '1rem' }} onClick={handleShop}>
                Shop Now
              </StyledButton>
            </OverlayText>
          </>
          // </Box >
        ))}
      </Carousel>
      {/* ) */}
      {/* } */}
    </Box >
  );
};

export default ImageCarousel;