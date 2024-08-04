import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import api from '../../../api';
import Cookies from 'js-cookie';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useAuth } from '@/contexts/auth';

const RequestAvailabilityModal = ({ product, open, handleClose }) => {
  const { user } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [whatsappURL, setWhatsappURL] = useState('');

  const handleSendRequest = async () => {
    const token = Cookies.get('token');

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
    } catch (error) {
      console.error('Error sending request:', error);
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
        <Typography id="request-availability-modal-title" variant="h6" component="h2">
          Kindly enter your mobile number to receive notifications about this product’s availability via WhatsApp.
        </Typography>
        <Typography id="request-availability-modal-description" sx={{ mt: 2 }}>
          You will be notified promptly, after which you can add it to your cart and complete your purchase.
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Your request will be forwarded to our team upon clicking the send request button.
        </Typography>
        <TextField
          label="Mobile Number"
          variant="outlined"
          fullWidth
          value={mobileNumber}
          onChange={handleMobileNumberChange}
          sx={{ mt: 2 }}
          helperText={isValid ? '' : 'Please enter a valid mobile number with country code'}
          error={!isValid}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSendRequest}
          sx={{ mt: 2 }}
          disabled={!isValid}
        >
          Send Request
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
