import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Avatar, Divider, Snackbar, Alert, useTheme } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import api from '../../../api';
import { useAuth } from '@/contexts/auth';
import Cookies from 'js-cookie';

const SignUpForm = ({ switchToLogin }) => {
  const theme = useTheme();
  const { setUser, closeAuthModal } = useAuth();
  const [email, setEmail] = useState('');
  const [emailOTP, setEmailOTP] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [step, setStep] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [alreadyVerify, setAlreadyVerify] = useState(false);

  const handleSendEmailOTP = async () => {
    try {
      const response = await api.post('/auth/send-email-otp', { email, role: 'user' });
      setSnackbarMessage(response?.data?.message || 'OTP sent to your email');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setStep(2);
    } catch (error) {
      setSnackbarMessage(error?.response?.data?.message || 'Failed to send email OTP');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleVerifyEmailOTP = async () => {
    try {
      const response = await api.post('/auth/verify-email-otp', { email, OTP: emailOTP, role: 'user' });
      const { isPhoneVerified, isEmailVerified } = response?.data?.data?.userdata;
      if (isEmailVerified) {
        const token = response?.data?.accessToken;
        Cookies.set('token', token, { expires: 365 });

        // const expirationDate = new Date(new Date().getTime() + 3 * 60 * 1000); // 5 minutes from now
        // Cookies.set('token', token, { expires: expirationDate });

        api.defaults.headers.Authorization = `Bearer ${token}`;
        const { data: user } = await api.get(`auth/${response?.data?.data?.userdata?.id}`);
        setUser(user);
        setSnackbarMessage(response?.data?.message || 'Email verified successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        if (isPhoneVerified) {
          setPhone(response?.data?.data?.userdata?.phoneNumber)
          setAlreadyVerify(true);
        }
        setStep(3);
      } else {
        setSnackbarMessage(response?.data?.message || 'Invalid email OTP');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(error?.response?.data?.message || 'Invalid email OTP');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSendPhoneOTP = async () => {
    try {
      const response = await api.post('/auth/send-phone-otp', { email, phoneNumber: phone, role: 'user' });
      setStep(4);
      setSnackbarMessage(response?.data?.message || 'OTP sent to your phone number!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error sending phone OTP:', error);
      setSnackbarMessage(error?.response?.data?.message || 'Failed to send phone OTP');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleVerifyPhoneOTP = async () => {
    try {
      const response = await api.post('/auth/verify-phone-otp', { phoneNumber: phone, OTP: phoneOTP, role: 'user' });
      const { isPhoneVerified } = response?.data?.data?.userdata;
      if (isPhoneVerified) {
        const token = response?.data?.accessToken;
        Cookies.set('token', token, { expires: 365 });

        // const expirationDate = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes from now
        // Cookies.set('token', token, { expires: expirationDate });

        api.defaults.headers.Authorization = `Bearer ${token}`;
        const { data: user } = await api.get(`auth/${response?.data?.data?.userdata?.id}`);
        setUser(user);
        setSnackbarMessage(response?.data?.message || 'Phone number verified successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        closeAuthModal();
      } else {
        setSnackbarMessage(response?.data?.message || 'Invalid phone OTP');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error verifying phone OTP:', error);
      setSnackbarMessage(error?.response?.data?.message || 'Invalid phone OTP');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundColor: theme.palette.background.paper }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Ayru Jaipur</Typography>
      <Paper sx={{ maxWidth: 400, mx: 'auto', p: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar variant="circular" sx={{ bgcolor: 'white', alignSelf: 'center' }}>
            <LockIcon color="primary" />
          </Avatar>
          <Typography alignSelf="center" mb="1rem" component="h1" variant="h4">
            Sign Up
          </Typography>
          <Divider />
          {step === 1 && (
            <Box>
              <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" />
              <Button fullWidth variant="contained" color="primary" onClick={handleSendEmailOTP} sx={{ mt: 2 }}>
                Send OTP
              </Button>
              <Button fullWidth variant="text" color="primary" onClick={switchToLogin} sx={{ mt: 2 }}>
                Already have an account? Sign In
              </Button>
            </Box>
          )}
          {step === 2 && (
            <Box>
              <TextField fullWidth label="Email" value={email} disabled margin="normal" />
              <TextField fullWidth label="Email OTP" value={emailOTP} onChange={(e) => setEmailOTP(e.target.value)} margin="normal" />
              <Button fullWidth variant="contained" color="primary" onClick={handleVerifyEmailOTP} sx={{ mt: 2 }}>
                Verify OTP
              </Button>
            </Box>
          )}
          {step === 3 ? (
            setAlreadyVerify ? (
              <Box>
                <TextField fullWidth label="Email" value={email} disabled margin="normal" />
                <TextField fullWidth label="Phone Number" value={phone} disabled margin="normal" />
                <Typography color="secondary">Phone number is already verified!!</Typography>
                <Button fullWidth variant="contained" color="secondary" onClick={closeAuthModal} sx={{ mt: 2 }}>
                  Go to Website
                </Button>
              </Box>
            ) : (
              <Box>
                <TextField fullWidth label="Email" value={email} disabled margin="normal" />
                <TextField fullWidth label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} margin="normal" />
                <Button fullWidth variant="contained" color="primary" onClick={handleSendPhoneOTP} sx={{ mt: 2 }}>
                  Send Phone OTP
                </Button>
                <Button fullWidth variant="contained" color="secondary" onClick={closeAuthModal} sx={{ mt: 2 }}>
                  Go to Website
                </Button>
              </Box>
            )
          ) : null}
          {step === 4 && (
            <Box>
              <TextField fullWidth label="Email" value={email} disabled margin="normal" />
              <TextField fullWidth label="Phone Number" value={phone} disabled margin="normal" />
              <TextField fullWidth label="Phone OTP" value={phoneOTP} onChange={(e) => setPhoneOTP(e.target.value)} margin="normal" />
              <Button fullWidth variant="contained" color="primary" onClick={handleVerifyPhoneOTP} sx={{ mt: 2 }}>
                Verify Phone OTP
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignUpForm;
