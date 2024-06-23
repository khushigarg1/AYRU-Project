import React, { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Card, CardContent, CardMedia, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import api from '../../api';

const ClientLoveCarousel = () => {
  const [clientLoves, setClientLoves] = useState([]);
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

  const groupedClientLoves = [];
  for (let i = 0; i < clientLoves.length; i += isMobile ? 1 : 2) {
    groupedClientLoves.push(clientLoves.slice(i, i + (isMobile ? 1 : 2)));
  }

  return (
    <Box sx={{ width: isMobile ? "100%" : "70%", margin: "0 auto", marginBottom: "4%", marginTop: "4%" }}>
      <Box style={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant={isMobile ? 'h4' : 'h3'} sx={{ mb: 4, color: theme.palette.text.text }}>
          Client Love
        </Typography>
      </Box>
      {clientLoves.length > 0 && (
        <Carousel
          autoPlay={true}
          interval={2000}
          animation="slide"
          navButtonsAlwaysVisible={!isMobile}
          indicators={false}
        >
          {
            groupedClientLoves.map((group, index) => (
              <Box key={index} display="flex" justifyContent="center" sx={{ gap: 2 }} style={{ backgroundColor: theme.palette.background.paper, padding: "3px 0px" }}>
                {group.map((item, idx) => (
                  <Card key={idx} sx={{
                    width: isMobile ? "350px" : "500px",
                    height: isMobile ? "600px" : "600px",
                    padding: "0px 10px",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    // borderRadius: "35px",
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Box sx={{ position: 'relative', flexGrow: 1 }}>
                      <CardMedia
                        component="img"
                        image={`${api.defaults.baseURL}image/${item.imageUrl}`}
                        alt={`Slide ${idx}`}
                        sx={{
                          objectFit: 'contain',
                          width: '100%',
                          height: '100%',
                          backgroundColor: theme.palette.background.paper,
                          // borderRadius: "35px"
                        }}
                      />
                    </Box>
                    <CardContent sx={{ backgroundColor: theme.palette.background.paper }}>
                      <Typography variant="body1" component="div">
                        {item?.text}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ))
          }
        </Carousel>
      )
      }
    </Box >
  );
};

export default ClientLoveCarousel;
