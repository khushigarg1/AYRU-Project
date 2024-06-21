// import React from 'react';
// import { Grid, useTheme } from '@mui/material';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
// import PaymentIcon from '@mui/icons-material/Payment';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
// import HomeIcon from '@mui/icons-material/Home';
// import { styled } from "@mui/material/styles";
// import { Language } from '@mui/icons-material';

// const InfoContainer = styled(Grid)(({ theme }) => ({
//   padding: '10px',
//   marginTop: "5px",
//   backgroundColor: theme.palette.background.paper,
//   borderRadius: '8px',
//   overflow: 'hidden',
//   whiteSpace: 'nowrap',
//   textOverflow: 'ellipsis',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   color: theme.palette.text.primary
// }));

// const InfoItem = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   flexDirection: "column",
//   gap: '10px',
//   margin: '5px 0',
// }));

// const InfoText = styled('span')(({ theme }) => ({
//   fontFamily: 'serif',
//   fontSize: '0.9rem',
//   fontWeight: '500',
//   wordWrap: 'wrap',
//   '&:hover': {
//     textDecoration: 'underline',
//   },
//   [theme.breakpoints.up('sm')]: {
//     fontSize: '0.9rem',
//   },
//   [theme.breakpoints.up('lg')]: {
//     fontSize: '1.5rem',
//   },
//   color: theme.palette.text.primary

// }));

// export const InfoIcons = {
//   cotton: <CheckCircleOutlineIcon fontSize="large" />,
//   shipping: <Language fontSize="large" />,
//   payment: <PaymentIcon fontSize="large" />,
//   delivery: <LocalShippingIcon fontSize="large" />,
//   jaipur: <HomeIcon fontSize='large' />
// };

// export const InfoComponent = () => {
//   const theme = useTheme();

//   return (
//     <InfoContainer container spacing={2}>
//       <Grid
//         container
//         item
//         xs={12}
//         md={6}
//         justifyContent="center"
//         style={{
//           flexDirection: 'row',
//           columnGap: '12px',
//           gap: '12px',
//           rowGap: '15px'
//         }}
//       >
//         <InfoItem>
//           {InfoIcons.cotton}
//           <InfoText >100% Cotton</InfoText>
//         </InfoItem>
//         <InfoItem>
//           {InfoIcons.shipping}
//           <InfoText>Shipping Worldwide</InfoText>
//         </InfoItem>
//         <InfoItem>
//           {InfoIcons.payment}
//           <InfoText>Secure Payment</InfoText>
//         </InfoItem>
//         <InfoItem>
//           {InfoIcons.delivery}
//           <InfoText>Free Shipping</InfoText>
//         </InfoItem>
//         <InfoItem>
//           {InfoIcons.jaipur}
//           <InfoText>Made in Jaipur</InfoText>
//         </InfoItem>
//       </Grid>

//     </InfoContainer>
//   );
// };

// export default InfoComponent;
import React from 'react';
import { Box, Typography, useTheme, Grid } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HomeIcon from '@mui/icons-material/Home';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const InfoIcons = {
  cotton: <CheckCircleOutlineIcon fontSize="large" />,
  shipping: <LocalShippingIcon fontSize="large" />,
  payment: <PaymentIcon fontSize="large" />,
  delivery: <FlightTakeoffIcon fontSize="large" />,
  jaipur: <HomeIcon fontSize="large" />
};

const slides = [
  {
    icon: InfoIcons.cotton,
    title: '100% Cotton',
    description: 'Our entire range is made from 100% natural cotton.',
  },
  {
    icon: InfoIcons.jaipur,
    title: 'Made in Jaipur',
    description: 'Authentic Jaipur creations, blending tradition and modernity.',
  },
  // {
  //   icon: InfoIcons.shipping,
  //   title: 'Shipping Worldwide',
  //   description: 'Cost-effective global shipping at your convenience.',
  // },
  // {
  //   icon: InfoIcons.payment,
  //   title: 'Secure Payment',
  //   description: 'Shop confidently with our secure payment methods.',
  // },
  // {
  //   icon: InfoIcons.delivery,
  //   title: 'Free Shipping',
  //   description: 'Enjoy Free Delivery across India with every order.',
  // },
];

export const InfoComponent = () => {
  const theme = useTheme();

  return (
    <Box sx={{ padding: 1, marginTop: 1, borderRadius: 2, color: theme.palette.text.primary, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={3000}
        showArrows={true}
        emulateTouch={true}
      // width="100%"
      >
        {slides.map((slide, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 1 }}>
            <Grid container alignItems="center" spacing={0}>
              <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                {slide.icon}
              </Grid>
              <Grid item xs={10} sx={{ display: 'flex', flexDirection: 'column', alignItems: "left" }}>
                <Typography variant="h6" gutterBottom>
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
