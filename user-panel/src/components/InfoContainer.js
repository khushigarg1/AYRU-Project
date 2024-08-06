import React from 'react';
import { Box, Typography, useTheme, Grid, Paper, useMediaQuery } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HandymanIcon from '@mui/icons-material/Handyman';
import HomeIcon from '@mui/icons-material/Home';
import Carousel from 'react-material-ui-carousel';
import { Handyman, Language, VolunteerActivism } from '@mui/icons-material';

const InfoIcons = {
  cotton: <CheckCircleOutlineIcon fontSize="large" />,
  jaipur: <HomeIcon fontSize="large" />,
  handmade: <VolunteerActivism fontSize='large' />,
  payment: <PaymentIcon fontSize="large" />,
  shipping: <Language fontSize="large" />,
  delivery: <LocalShippingIcon fontSize="large" />,
};

const slides = [
  {
    icon: InfoIcons.cotton,
    title: '100% Cotton',
    description: 'Our entire range is made from 100% natural cotton.',
  },
  {
    icon: InfoIcons.jaipur,
    title: 'Made in Jaipur only',
    description: 'Authentic Jaipur creations, blending tradition and modernity.',
  },
  {
    icon: InfoIcons.handmade,
    title: 'Handmade',
    description: 'Unique, Hand-Block prints inspired by Jaipur’s rich heritage.',
  },
  {
    icon: InfoIcons.payment,
    title: 'Secure Payment',
    description: 'Shop confidently with our secure payment methods.',
  },
  {
    icon: InfoIcons.delivery,
    title: 'Free Shipping',
    description: 'Enjoy Free Delivery across India with every order.',
  },
  {
    icon: InfoIcons.shipping,
    title: 'Shipping Worldwide',
    description: 'Cost-effective global shipping at your convenience.',
  },
];

export const InfoComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ padding: 1, marginTop: 1, borderRadius: 2, color: theme.palette.text.primary, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
      <Carousel
        autoPlay={true}
        interval={2000}
        animation="slide"
        indicators={false}
        cycleNavigation={true}
        sx={{
          width: '100%',
          maxWidth: '800px',
        }}
      >
        {slides.map((slide, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2, width: '100%', boxSizing: 'border-box' }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                {slide.icon}
              </Grid>
              <Grid item xs={10} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" gutterBottom style={{ marginBottom: "0px" }}>
                  {slide.title}
                </Typography>
                <Typography variant="body1">
                  {slide.description}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default InfoComponent;
