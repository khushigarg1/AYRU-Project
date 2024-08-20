import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Divider, FormHelperText } from '@mui/material';
import api from '../../../api';
import Cookies from 'js-cookie';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useAuth } from '@/contexts/auth';

const RequestAvailabilityModal = ({ getAvailabilityStatus, product, open, handleClose }) => {
  const { user } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [whatsappURL, setWhatsappURL] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async () => {
    const token = Cookies.get('token');
    setLoading(true);
    try {
      await api.post(
        'availability/',
        {
          inventoryid: product?.id,
          mobilenumber: mobileNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Open WhatsApp with a message
      const url = `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hey,\n\nI am looking to buy this amazing product: ${product?.productName}\n${process.env.REACT_APP_BASE_URL}/shop/${product?.id}\n\nCould you please confirm its availability at your earliest convenience?\n\nMobile No.: ${mobileNumber}\nEmail: ${user?.email}\n\nThank You!`
      )}`;

      setWhatsappURL(url);

      // Redirect to WhatsApp
      window.open(url, '_blank');

      // Optionally, close the modal
      handleClose();
      getAvailabilityStatus();
    } catch (error) {
      console.error('Error sending request:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mobile number validation function using libphonenumber
  const validateMobileNumber = (number) => {
    const phoneNumber = parsePhoneNumberFromString(number);
    return phoneNumber && phoneNumber.isValid();
  };

  // Handle mobile number input change
  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    setMobileNumber(value);
    setIsValid(validateMobileNumber(value));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="request-availability-modal-title"
      aria-describedby="request-availability-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography id="request-availability-modal-title" variant="h5" sx={{ lineHeight: 1.2, textAlign: "center" }} mb={1}>
          Enter your Whatsapp number
          {/* Kindly enter your mobile number to receive notifications about this product’s availability via WhatsApp. */}
        </Typography>
        <Divider />
        <Typography variant='body2' id="request-availability-modal-description" sx={{ mt: 2, lineHeight: 1.2 }}>
          You will receive a notification that will confirm the availability of this product.
          {/* You will be notified promptly, after which you can add it to your cart and complete your purchase. */}
        </Typography>
        <Typography variant='body2' sx={{ mt: 1, lineHeight: 1.2 }}>
          {/* Your request will be forwarded to our team upon clicking the send request button. */}
          Once this confirmation is received, you will be able to add this product to cart, and place furthur order.
        </Typography>
        <Typography variant='body2' color="success" sx={{ mt: 2, lineHeight: 1.2, color: "green" }}>
          **Please wait upto 24 hours to receive an update.
        </Typography>
        <TextField
          label="Mobile Number"
          variant="outlined"
          fullWidth
          value={mobileNumber}
          onChange={handleMobileNumberChange}
          sx={{ mt: 2 }}

          helperText={
            <FormHelperText sx={{ color: !isValid ? 'error.main' : 'text.secondary', lineHeight: 1.2, margin: "0px" }}>
              {!isValid ? 'Please enter a valid mobile number, including country code (e.g., +919912345678)' : ''}
            </FormHelperText>
          }
          // helperText={isValid ? '' : 'Please enter a valid mobile number, including country code (e.g., +919912345678)'}
          error={!isValid}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSendRequest}
          sx={{ mt: 2 }}
          disabled={!isValid || loading}
        >
          {loading ? 'Sending...' : 'Send Request'}
        </Button>

        <Button
          variant="outlined"
          color="inherit"
          onClick={handleClose}
          sx={{ mt: 2, width: '100%' }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default RequestAvailabilityModal;
