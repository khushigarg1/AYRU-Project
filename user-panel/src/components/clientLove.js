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
    <Box sx={{ width: isMobile ? "100%" : "70%", margin: "0 auto", marginTop: "4%", marginBottom: "25px", padding: "0px" }}>
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
          sx={{ padding: "0px" }}
        >
          {
            groupedClientLoves.map((group, index) => (
              <Box key={index} display="flex" justifyContent="center" sx={{ gap: 2 }} style={{ backgroundColor: theme.palette.background.paper, padding: "0px" }}>
                {group.map((item, idx) => (
                  <Card key={idx} sx={{
                    width: "100%",
                    height: "100%s",
                    // width: isMobile ? "100%" : "500px",
                    // height: isMobile ? "100%" : "600px",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    display: 'flex',
                    flexDirection: 'column'
                    , padding: "0px"
                  }}>
                    <Box sx={{ position: 'relative', flexGrow: 1 }}>
                      <CardMedia
                        component="img"
                        image={`https://ayrujaipur.s3.amazonaws.com/${item.imageUrl}`}
                        alt={`Slide ${idx}`}
                        sx={{
                          objectFit: 'contain',
                          width: '100%',
                          height: '100%',
                          backgroundColor: theme.palette.background.paper
                          , padding: "0px"
                          // borderRadius: "35px"
                        }}
                      />
                    </Box>
                    <CardContent sx={{
                      backgroundColor: theme.palette.background.paper, padding: "0px",
                      "&:last-child": {
                        paddingBottom: 0,
                      },
                    }}>
                      <Typography variant="body1" component="div" sx={{ padding: "0px" }}>
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
