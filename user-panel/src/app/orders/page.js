"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, Grid, Box, CardMedia, Chip, IconButton, Divider } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import api from '../../../api';
import Cookies from 'js-cookie';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/navigation';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = Cookies.get('token');
      try {
        const response = await api.get('/order/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container p={0}>
      <Typography variant="h4" gutterBottom>Orders</Typography>
      <Grid container spacing={1} pl={0} mt={1} pr={0}>
        {orders?.map((order) => (
          <Grid item key={order.id} xs={12} sm={12} md={12} lg={12} sx={{ height: "auto" }}>
            <Card sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'row',
              height: '100%',
              cursor: "pointer",
              backgroundColor: "white",
              maxHeight: "100%",
              padding: "15px 5px",
              boxShadow: "none"
            }}
              onClick={() => router.push(`/orders/${order.id}`)}
            >
              <Box sx={{ position: 'relative' }}>
                <Chip
                  label={
                    <div style={{ textAlign: 'center' }}>
                      <Typography variant="caption" component="span" sx={{ lineHeight: 1, fontWeight: "bolder" }}>
                        {order?.orderItems.length}
                      </Typography>
                    </div>
                  }
                  color="secondary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 1,
                    padding: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '18px',
                    width: '18px',
                    borderRadius: '50%',
                    fontSize: '1px',
                    fontWeight: 'bold',
                  }}
                />
                <CardMedia
                  component="img"
                  image={`https://ayru-jaipur.s3.amazonaws.com/${order?.orderItems[0]?.inventory?.Media[0]?.url}`}
                  alt={order?.orderItems[0]?.inventory.productName}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/shop/${order?.orderItems[0]?.inventory?.id}`);
                  }}
                  sx={{
                    objectFit: 'fit',
                    height: "120px",
                    width: "100px",
                    padding: "5px",
                    borderRadius: "0px"
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1, padding: "12px", '&:last-child': { paddingBottom: "10px", position: "relative" }, paddingTop: "0px" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Order #{order.id} / {formatDate(order.createdAt)}</Typography>
                <Typography variant="body2"><strong>Order Status: </strong>{order.status}</Typography>
                <Typography variant="body2"><strong>Payment Status: </strong>{order.paymentStatus}</Typography>
                <Typography variant="body2"><strong>Delivery Status: </strong>{order.deliveryStatus}</Typography>
                <Typography variant="body2"><strong>Total: </strong>Rs.{order.Total}</Typography>
              </CardContent>
              <IconButton
                edge="end"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/order/${order.id}`);
                }}
                sx={{
                  alignSelf: 'center',
                }}
              >
                <ArrowForwardIosIcon width={10} height={10} />
              </IconButton>
            </Card>
            <Divider />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Orders;
