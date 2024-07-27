"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, TextField, Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { useAuth } from '@/contexts/auth';
import api from '../../../api';

const SettingsPage = () => {
  const { user } = useAuth();
  const [password, setPassword] = useState('');

  const handlePasswordChange = () => {
    api.post('/auth/set-password', { email: user?.email, role: "user", newPassword: password }).then(() => {
      alert('Password updated successfully');
      setPassword('');
    }).catch((error) => {
      alert('Error updating password: ' + error.message);
    });
  };
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Link href="/orders" passHref>
              <Button variant="contained" fullWidth>My Orders</Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Link href="/cart" passHref>
              <Button variant="contained" fullWidth>My Cart</Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Link href="/wishlist" passHref>
              <Button variant="contained" fullWidth>Wishlist Items</Button>
            </Link>
          </Grid>
        </Grid>
      </Paper>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Account Settings</Typography>

        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6">Update Password</Typography>
          <TextField
            type="password"
            label="New Password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button variant="contained" onClick={handlePasswordChange}>Update Password</Button>
        </Paper>
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6">User Details</Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            disabled
            value={`${user?.firstName} ${user?.lastName}`}
            sx={{ my: 2 }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            disabled
            value={user?.email}
            sx={{ my: 2 }}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            disabled
            value={user?.phoneNumber}
            sx={{ my: 2 }}
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            disabled
            value={`${user?.address1}, ${user?.address2}, ${user?.city}, ${user?.state}, ${user?.country}, ${user?.pincode}`}
            sx={{ my: 2 }}
          />
        </Paper>

      </Box>
    </Box>
  );
};

export default SettingsPage;
