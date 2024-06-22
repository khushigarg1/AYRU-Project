import React, { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Card, CardContent, CardMedia, Typography, styled, useMediaQuery, useTheme } from '@mui/material';
import api from '../../api';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const ClientLoveCarousel = () => {
  const [clientLoves, setClientLoves] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  return (
    <Box sx={{ marginTop: "4%", marginBottom: "4%" }}>
      {clientLoves.length > 0 && (
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
              bottom: '20px',
              top: 'unset !important',
              '&:nth-of-type(1)': {
                left: '20px',
              },
              '&:nth-of-type(2)': {
                right: '20px',
              },
            }
          }}
          NextIcon={<ArrowForwardIos />}
          PrevIcon={<ArrowBackIos />}
          indicators={false}
        >
          {clientLoves.map((item, index) => (
            // <Box key={index} sx={{ position: 'relative', height: 'auto' }}>
            //   <StyledImage
            //     src={`${api.defaults.baseURL}image/${item.imageUrl}`}
            //     alt={`Slide ${index}`}
            //   />
            //   <OverlayText>
            //     <LargeText>{item.text}</LargeText>
            //   </OverlayText>
            // </Box>
            <Card  >
              <CardMedia
                component="img"
                height={isMobile ? 250 : 400}
                image={`${api.defaults.baseURL}image/${item.imageUrl}`}
                alt={`Slide ${index}`}
              />
              <CardContent sx={{ height: "20%", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'wrap' }}>
                <Typography gutterBottom variant="body1" component="div">
                  {item?.text}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Carousel>
      )}
    </Box>
  );
};

export default ClientLoveCarousel;
