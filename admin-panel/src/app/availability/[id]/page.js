"use client";
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Box,
  Divider,
  Card,
  CardMedia,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import api from '@/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AvailabilityPage = ({ params }) => {
  const { id } = params;
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getAvailability = async () => {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      const response = await api.get(`/availability/single/${id}`);
      setAvailability(response?.data?.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  useEffect(() => {
    getAvailability();
  }, [id]);

  const sendWhatsAppMessage = (status) => {
    const productName = availability?.inventory?.productName;
    const productLink = `https://ayrujaipur.in/shop/${availability?.inventory?.id}`;
    const message =
      status === 'approved'
        ? `Yay!! Your request has been approved for product: ${productName}.\n Yes, it is available for purchase.\n\nNow you can add it to your cart and complete the checkout process using the following link: ${productLink}\n\nPlease Note: The checkout must be completed within 48 hours. After this period, you will need to verify the product’s availability again.\n\nThank you for your patience\n\nFrom\nAYRU JAIPUR`
        : `We regret to inform you that

*${productName} is currently unavailable.*

For any further inquiries or assistance, please feel free to reply to this message.

We appreciate your understanding.

*AYRU JAIPUR*`;

    const phoneNumber = availability?.mobilenumber;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  };


  const handleUpdateStatus = async (status) => {
    try {
      await api.put(`/availability/${id}`, { status });
      alert(`Request ${status === 'approved' ? 'accepted' : 'rejected'} successfully`);
      sendWhatsAppMessage(status);
      getAvailability();
    } catch (error) {
      console.error(`Error updating availability status to ${status}:`, error);
    }
  };


  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Availability Details({availability?.status})</Typography>
      </Box>
      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={() => handleUpdateStatus('approved')} sx={{ mr: 1 }}>
          Accept
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleUpdateStatus('rejected')}>
          Reject
        </Button>
      </Box>
      <Divider />
      {availability && (
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">Details</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">Status: {availability?.status}</Typography>
              <Typography variant="body2">Requested Date: {new Date(availability?.createdAt).toLocaleDateString()}</Typography>
              <Typography variant="body2">User Email: {availability?.user?.email}</Typography>
              <Typography variant="body2">Mobile Number: {availability?.mobilenumber}</Typography>
            </Paper>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }}>
                <Grid container spacing={2} direction={isMobile ? "column" : "row"}>
                  <Grid item xs={12} md={2}>
                    <Card>
                      <CardMedia
                        component="img"
                        image={`https://ayrujaipur.s3.amazonaws.com/${availability?.inventory?.Media[0]?.url}`}
                        alt={availability?.inventory?.productName}
                        sx={{ height: 200, objectFit: "contain" }}
                        onClick={() => router.push(`/inventory/${availability?.inventory?.id}`)}
                      />
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <CardContent onClick={() => router.push(`/inventory/${availability?.inventory?.id}`)}
                    >
                      <Typography variant="h6">{availability?.inventory?.productName}</Typography>
                      <Typography variant="body2">SKU: {availability?.inventory?.skuId}</Typography>
                      <Typography variant="body2">Category: {availability?.inventory?.Category?.categoryName}</Typography>
                      <Typography variant="body2">Requested by: {availability?.user?.firstName} {availability?.user?.lastName}</Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default AvailabilityPage;
