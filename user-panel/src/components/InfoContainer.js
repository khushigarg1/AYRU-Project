import React from 'react';
import { Box, Typography, useTheme, Grid, Paper, useMediaQuery } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HandymanIcon from '@mui/icons-material/Handyman';
import HomeIcon from '@mui/icons-material/Home';
import Carousel from 'react-material-ui-carousel';
import { Handyman, Language, VolunteerActivism } from '@mui/icons-material';
import QualityImage from "../../public/images/quality.png";
import Image from 'next/image';
import WebpImage from "../../public/images/blog1.webp";


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
    <>
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
      <Box sx={{ display: 'flex', paddingX: "50px", justifyContent: 'center', marginTop: 1, position: 'relative', width: '100%', backgroundColor: theme.palette.background.paper }}>
        <Image src={WebpImage} alt="Left Image" width={100} height={100} style={{ position: 'absolute', left: '-8px', top: isMobile ? "80%" : "65%", transform: 'translateY(-50%)', maxWidth: '20%', height: 'auto' }} />
        <Paper sx={{ padding: 2, textAlign: 'center', maxWidth: '800px', boxShadow: "none", fontFamily: theme.palette.typography.fontFamily }}>
          <Image src={QualityImage} alt="Premium Quality" width={50} height={50} style={{ maxWidth: '60%', height: 'auto', margin: 'auto' }} />
          <Typography variant="h6" gutterBottom={!isMobile}>
            Premium Quality
          </Typography>
          <Typography variant="body1" style={{ fontSize: "90%" }}>
            We prioritize the finest, high-quality, and pleasant products, that you can trust.
          </Typography>
        </Paper>
        <Image src={WebpImage} alt="Right Image" width={100} height={100} style={{ position: 'absolute', right: '-8px', top: isMobile ? "80%" : "65%", transform: 'translateY(-50%)', maxWidth: '20%', height: 'auto' }} />
      </Box>
    </>
  );
};

export default InfoComponent;
