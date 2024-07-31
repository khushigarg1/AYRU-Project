import React, { useState } from 'react';
import { Box, Button, Paper, Typography, TextField, Accordion, AccordionSummary, AccordionDetails, Divider, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandMoreSharp } from '@mui/icons-material';
import Image from 'next/image';
import RajorPay from "../../../public/images/razorpay.png";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';

const ShippingDetailsBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  backgroundColor: "#fff",
}));

const ShippingInfoBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  backgroundColor: "#fff",
  display: 'flex',
  flexDirection: "column",
  gap: theme.spacing(1),
}));

// Styled circle wrapper with border and no background color
const CircleWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 25,
  height: 25,
  borderRadius: '50%',
  border: `2px solid ${theme.palette.primary.main}`,
  position: 'relative',
}));

// Styled inner circle with a filled color
const InnerCircle = styled(Box)(({ theme }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  position: 'absolute',
}));

export const PaymentStep = ({ handleNext, orderData, setOrderData }) => {
  const theme = useTheme();
  const [extraNote, setExtraNote] = useState(orderData?.extraNote || '');

  const handleExtraNoteChange = (event) => {
    setExtraNote(event.target.value);
    setOrderData({
      extraNote: event.target.value,
    });
  };

  return (
    <>
      <Paper sx={{ p: 1, backgroundColor: "transparent", boxShadow: "none" }}>
        <ShippingInfoBox>
          <Typography variant="body2">
            {/* <CircleWrapper>
              <InnerCircle />
            </CircleWrapper> */}
            {/* 🚚  */}
            <strong>Standard Shipping</strong>
          </Typography>
          <Typography variant="body2" style={{ color: theme.palette.primary.contrastText }}>
            Your order will be dispatched within 2 days. Thank you for your patience! 😊
          </Typography>
        </ShippingInfoBox>

        <Typography mt={2} variant="h6">
          {/* 💳  */}
          Payment</Typography>
        <Box p={2} style={{ backgroundColor: "#fff" }}>
          <Typography variant="body2" color="textSecondary">
            🔒 Razorpay is a trusted payment gateway offering seamless and secure transactions. Enjoy a smooth checkout experience with Razorpay.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
            {/* <RazorpayIcon sx={{ fontSize: 30, color: 'green', mr: 2 }} /> */}
            {/* <Typography variant="h6">💵 Razorpay</Typography> */}
            <Image src={RajorPay}></Image>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon color="success" sx={{ mr: 1 }} fontSize='4' />
              <Typography variant="body2">Easy to Use</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PaymentIcon color="primary" sx={{ mr: 1 }} fontSize='4' />
              <Typography variant="body2">Multiple Payment Methods</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SecurityIcon color="action" sx={{ mr: 1 }} fontSize='4' />
              <Typography variant="body2">Highly Secure</Typography>
            </Box>
          </Box>
        </Box>

        <Typography mt={2} variant="h6">
          {/* 📦  */}
          Shipping Details</Typography>
        <Accordion defaultExpanded style={{ backgroundColor: "#fff" }}>
          <AccordionSummary expandIcon={<ExpandMoreSharp />} mb={0}>
            <Typography>Shipping Details</Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails style={{ paddingTop: "0px" }}>
            <ShippingDetailsBox>
              <Typography variant="body2"><strong>First Name:</strong> {orderData?.firstName || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Last Name:</strong> {orderData?.lastName || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Email:</strong> {orderData?.email || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Phone Number:</strong> {orderData?.phoneNumber || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Alternate Mobile Number:</strong> {orderData?.alternateMobileNumber || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Address Line 1:</strong> {orderData?.addressLine1 || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Address Line 2:</strong> {orderData?.addressLine2 || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Country:</strong> {orderData?.country || 'N/A'}</Typography>
              <Typography variant="body2"><strong>State:</strong> {orderData?.state || 'N/A'}</Typography>
              <Typography variant="body2"><strong>City:</strong> {orderData?.city || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Pincode:</strong> {orderData?.pincode || 'N/A'}</Typography>
              {/* <Typography variant="body2"><strong>📝 Additional Notes:</strong> {orderData?.extraNote || 'N/A'}</Typography> */}
            </ShippingDetailsBox>
          </AccordionDetails>
        </Accordion>

        <Typography mt={2} mb={1} variant="h6">
          {/* 🗒  */}
          Special Instructions for Seller</Typography>
        <Box>
          <TextField
            label="How can we help you?"
            multiline
            rows={4}
            fullWidth
            value={orderData?.extraNote}
            onChange={handleExtraNoteChange}
            variant="outlined"
            sx={{ backgroundColor: '#fff' }}
          />
        </Box>
      </Paper>

      <Button variant='contained' onClick={handleNext} sx={{ width: "100%", mt: 2 }}>
        Continue ➡️
      </Button>
    </>
  );
};
