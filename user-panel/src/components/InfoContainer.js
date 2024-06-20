// import React from 'react';
// import { Grid, useTheme } from '@mui/material';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
// import PaymentIcon from '@mui/icons-material/Payment';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
// import HomeIcon from '@mui/icons-material/Home';
// import { styled } from "@mui/material/styles";

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
//   color: theme.palette.primary.contrastText
// }));

// const InfoItem = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   flexDirection: "column",
//   gap: '10px',
//   margin: '5px 0',
// }));

// const InfoText = styled('span')(({ theme }) => ({
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
// }));

// export const InfoIcons = {
//   cotton: <CheckCircleOutlineIcon fontSize="large" />,
//   shipping: <LocalShippingIcon fontSize="large" />,
//   payment: <PaymentIcon fontSize="large" />,
//   delivery: <FlightTakeoffIcon fontSize="large" />,
//   jaipur: <HomeIcon fontSize='large' />
// };

// export const InfoComponent = () => {
//   const theme = useTheme();

//   return (
//     <InfoContainer container spacing={2}>
//       <Grid style={{
//         flexDirection: "row",
//         columnGap: '10px',
//       }} container item xs={12} sm={6} md={6}>
//         <InfoItem>
//           {InfoIcons.cotton}
//           <InfoText>100% Cotton</InfoText>
//         </InfoItem>
//         <InfoItem>
//           {InfoIcons.shipping}
//           <InfoText>Shipping Wordwide</InfoText>
//         </InfoItem>
//         <InfoItem>
//           {InfoIcons.payment}
//           <InfoText>Secure Payment</InfoText>
//         </InfoItem>
//       </Grid>

//       <Grid style={{
//         flexDirection: "row",
//         columnGap: '15px',
//       }} container item xs={12} sm={6} md={6} justifyContent="center">
//         <InfoItem >
//           {InfoIcons.delivery}
//           <InfoText>Free Delivery</InfoText>
//         </InfoItem>
//         <InfoItem>
//           {InfoIcons.jaipur}
//           <InfoText>Made in Jaipur</InfoText>
//         </InfoItem>
//       </Grid>
//     </InfoContainer>
//   );
// };
import React from 'react';
import { Grid, useTheme } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HomeIcon from '@mui/icons-material/Home';
import { styled } from "@mui/material/styles";
import { Language } from '@mui/icons-material';

const InfoContainer = styled(Grid)(({ theme }) => ({
  padding: '10px',
  marginTop: "5px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.primary
}));

const InfoItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: "column",
  gap: '10px',
  margin: '5px 0',
}));

const InfoText = styled('span')(({ theme }) => ({
  fontFamily: 'serif',
  fontSize: '0.9rem',
  fontWeight: '500',
  wordWrap: 'wrap',
  '&:hover': {
    textDecoration: 'underline',
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '0.9rem',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '1.5rem',
  },
  color: theme.palette.text.primary

}));

export const InfoIcons = {
  cotton: <CheckCircleOutlineIcon fontSize="large" />,
  shipping: <Language fontSize="large" />,
  payment: <PaymentIcon fontSize="large" />,
  delivery: <LocalShippingIcon fontSize="large" />,
  jaipur: <HomeIcon fontSize='large' />
};

export const InfoComponent = () => {
  const theme = useTheme();

  return (
    <InfoContainer container spacing={2}>
      <Grid
        container
        item
        xs={12}
        md={6}
        justifyContent="center"
        style={{
          flexDirection: 'row',
          columnGap: '12px',
          gap: '12px',
          rowGap: '15px'
        }}
      >
        <InfoItem>
          {InfoIcons.cotton}
          <InfoText >100% Cotton</InfoText>
        </InfoItem>
        <InfoItem>
          {InfoIcons.shipping}
          <InfoText>Shipping Worldwide</InfoText>
        </InfoItem>
        <InfoItem>
          {InfoIcons.payment}
          <InfoText>Secure Payment</InfoText>
        </InfoItem>
        <InfoItem>
          {InfoIcons.delivery}
          <InfoText>Free Shipping</InfoText>
        </InfoItem>
        <InfoItem>
          {InfoIcons.jaipur}
          <InfoText>Made in Jaipur</InfoText>
        </InfoItem>
      </Grid>

    </InfoContainer>
  );
};

export default InfoComponent;
