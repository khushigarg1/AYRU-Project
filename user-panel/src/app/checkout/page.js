"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { Box, Button, Stepper, Step, StepLabel, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, TextField, Checkbox, FormControlLabel, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '@/contexts/auth';
import { BillingAndShippingStep } from '@/components/checkout/billingShipping';
import { PaymentStep } from '@/components/checkout/payment';
import { ReviewAndConfirmStep } from '@/components/checkout/reviewconfirm';
import Cookies from 'js-cookie';
import api from '../../../api';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { ArrowBackIosNewSharp } from '@mui/icons-material';

const steps = ['Billing and Shipping', 'Review and Confirm'];
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 12,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor:
        theme.palette.background.contrast, // Example gradient
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor:
        theme.palette.background.contrast, // Example gradient
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));


const CheckoutPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeStep, setActiveStep] = useState(0);
  const { user, openAuthModal } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [Totalcount, setTotalCount] = useState(0);
  const token = Cookies.get('token');
  const [orderData, setOrderData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    alternateMobileNumber: '',
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    city: '',
    state: '',
    country: '',
    remark: '',
    payment: {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    },
    orderItems: [],
    Total: 0,
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSetOrderData = (newData) => {
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      ...newData,
    }));
  };


  const fetchcartStatus = async () => {
    try {
      if (token) {
        const response = await api.get(`/cart/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCartItems(response?.data?.data?.userCart);
        setTotalCount(response?.data?.data?.totalPrice);
        setOrderData((prevOrderData) => ({
          ...prevOrderData,
          orderItems: response?.data?.data?.userCart,
          Total: response?.data?.data?.totalPrice
        }));
        // console.log(response?.data?.data?.userCart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };
  useEffect(() => {
    // if (user && user.id && token) {
    fetchcartStatus();
    // }
  }, []);
  const handleLogin = () => {
    openAuthModal()
  };

  // const isStepOptional = (step) => {
  //   return step === 1;
  // };

  // const StepContent = ({ step }) => {
  //   switch (step) {
  //     case 0:
  //       return <BillingAndShippingStep user={user} onLogin={handleLogin} handleNext={handleNext} cartItems={cartItems} Totalcount={Totalcount} />;
  //     case 1:
  //       return <PaymentStep handleNext={handleNext} cartItems={cartItems} Totalcount={Totalcount} />;
  //     case 2:
  //       return <ReviewAndConfirmStep handleNext={handleNext} cartItems={cartItems} Totalcount={Totalcount} />;
  //     default:
  //       return null;
  //   }
  // };

  return (
    <Box mt={2} p={isMobile ? 1 : 3} sx={{ width: '100%', backgroundColor: "#F0F0F0", paddingTop: "8px" }}>
      <Stepper activeStep={activeStep} alternativeLabel connector={<ColorlibConnector />} mt={1}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          // if (isStepOptional(index)) {
          //   labelProps.optional = (
          //     <Typography variant="caption">Optional</Typography>
          //   );
          // }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {/* <Box sx={{ mt: 2, mb: 1 }}>
        <StepContent step={activeStep} />
      </Box> */}
      <Box>
        {activeStep === steps.length ? (
          <Typography>Order placed successfully!</Typography>
        ) : (
          <>
            {activeStep === 0 && (
              <BillingAndShippingStep user={user} onLogin={handleLogin} handleNext={handleNext} cartItems={cartItems} Totalcount={Totalcount} orderData={orderData} setOrderData={handleSetOrderData} />
            )}
            {/* {activeStep === 1 && (
              <PaymentStep handleNext={handleNext} cartItems={cartItems} Totalcount={Totalcount} orderData={orderData} setOrderData={handleSetOrderData} />
            )} */}
            {activeStep === 1 && (
              <ReviewAndConfirmStep handleNext={handleNext} cartItems={cartItems} Totalcount={Totalcount} orderData={orderData} setOrderData={handleSetOrderData} />
            )}
            <Box sx={{ color: "black" }}>
              <Button disabled={activeStep === 0} onClick={handleBack} sx={{ color: "black" }}>
                <ArrowBackIosNewSharp style={{ color: "black" }} /> Back
              </Button>
              {/* <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
              </Button> */}
            </Box>
          </>
        )}
      </Box>
      {/* {user &&
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            variant='contained'
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button variant='contained' onClick={handleNext} sx={{ width: "100%" }}>
            {activeStep === steps.length - 3 && 'Continue'}
            {activeStep === steps.length - 2 && 'Continue'}
            {activeStep === steps.length - 1 && 'Place Order'}
          </Button>
        </Box>
      } */}
    </Box>
  );
};


const CheckoutPageFinal = () => {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <CheckoutPage />
    </Suspense>
  );
};

export default CheckoutPageFinal;
