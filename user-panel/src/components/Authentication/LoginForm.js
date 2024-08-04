import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Avatar, Divider, Snackbar, Alert, useTheme } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import api from '../../../api';
import Cookies from 'js-cookie';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/navigation';

const LoginForm = ({ switchToSignUp }) => {
  const theme = useTheme();
  const { setUser, closeAuthModal } = useAuth();
  const [email, setEmail] = useState('');
  const [emailOTP, setEmailOTP] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const router = useRouter();

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

        api.defaults.headers.Authorization = `Bearer ${token}`;
        const { data: user } = await api.get(`auth/${response?.data?.data.userdata.id}`);
        setUser(user);
        setSnackbarMessage(response?.data?.message || 'OTP verified successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        closeAuthModal();
      } else {
        setSnackbarMessage(response?.data?.message || 'Invalid email OTP');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error verifying email OTP:', error);
      setSnackbarMessage(error?.response?.data?.message || 'Invalid email OTP');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleLoginWithEmailPassword = async () => {
    try {
      const response = await api.post('/auth/user/login', { email, password, role: 'user' });
      const { isPhoneVerified, isEmailVerified } = response?.data?.data;
      if (isEmailVerified) {
        setSnackbarMessage(response?.data?.message || 'Verified successfully!!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        const token = response?.data?.accessToken;
        Cookies.set('token', token, { expires: 365 });

        api.defaults.headers.Authorization = `Bearer ${token}`;
        const { data: user } = await api.get(`auth/${response?.data?.data?.id}`);
        setUser(user);
        closeAuthModal();
      } else {
        setSnackbarMessage(response?.data?.message || 'Email not verified');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setSnackbarMessage(error?.response?.data?.message || 'Invalid email or password');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundColor: theme.palette.background.paper }}>
      <Typography variant="h3" sx={{ mb: 2 }}>AYRU JAIPUR</Typography>
      <Paper sx={{ maxWidth: 400, mx: 'auto', p: 3, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar variant="circular" sx={{ bgcolor: 'white', alignSelf: 'center' }}>
            <LockIcon color="primary" />
          </Avatar>
          <Typography alignSelf="center" mb="1rem" component="h1" variant="h4">
            Log In
          </Typography>
          <Divider />
          {step === 1 && (
            <Box>
              <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" />
              <Button fullWidth variant="contained" color="primary" onClick={handleSendEmailOTP} sx={{ mt: 2 }}>
                Send OTP
              </Button>
              <Button fullWidth variant="outlined" color="primary" onClick={() => setStep(3)} sx={{ mt: 2 }}>
                Already a user? Login using password
              </Button>
              {/* <Button fullWidth variant="text" color="primary" onClick={switchToSignUp} sx={{ mt: 2 }}>
                Don't have an account? Sign Up
              </Button> */}
            </Box>
          )}
          {step === 2 && (
            <Box>
              <TextField fullWidth label="Email" value={email} disabled margin="normal" />
              <TextField fullWidth label="Email OTP" value={emailOTP} onChange={(e) => setEmailOTP(e.target.value)} margin="normal" />
              <Button fullWidth variant="outlined" color="primary" onClick={handleVerifyEmailOTP} sx={{ mt: 2 }}>
                Verify OTP
              </Button>
            </Box>
          )}
          {step === 3 && (
            <Box>
              <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" />
              <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" />
              <Button fullWidth variant="contained" color="primary" onClick={handleLoginWithEmailPassword} sx={{ mt: 2 }}>
                Sign In
              </Button>
              <Button fullWidth variant="outlined" color="primary" onClick={() => setStep(1)} sx={{ mt: 2 }}>
                Verify with OTP
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

export default LoginForm;
