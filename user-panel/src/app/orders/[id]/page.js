"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, Grid, Box, CardMedia, Chip, IconButton, Divider, Accordion, AccordionSummary, AccordionDetails, Tooltip, useTheme } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import api from '../../../../api';
import Cookies from 'js-cookie';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/navigation';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { FileCopyOutlined, FileCopySharp } from '@mui/icons-material';

const OrderDetails = ({ params }) => {
  const { id } = params;
  const [order, setOrder] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  useEffect(() => {
    const fetchOrders = async () => {
      const token = Cookies.get('token');
      try {
        const response = await api.get(`/order/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrder(response.data);
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

  if (!order) {
    return <div>Loading...</div>;
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Container p={0} mb={14}>
      {/* <Typography variant="h4" gutterBottom>Order Details</Typography> */}
      {order && (
        <>
          <Typography variant="h6" gutterBottom mt={2} sx={{ fontWeight: "bolder" }}>Order Details</Typography>
          <Card sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            cursor: "pointer",
            backgroundColor: "#F0F0F0",
            maxHeight: "100%",
            padding: "15px 5px",
            boxShadow: "none"
          }}
            onClick={() => router.push(`/order/${order.id}`)}
          >
            <CardContent sx={{ flexGrow: 1, padding: "12px", '&:last-child': { paddingBottom: "10px", position: "relative" }, paddingTop: "0px" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>OrderId: {order.orderid}</Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>Placed on: {formatDate(order.createdAt)}</Typography>
              <Typography variant="body2"><strong>Order Status: </strong>{order.status}</Typography>
              <Typography variant="body2"><strong>Payment Status: </strong>{order.paymentStatus}</Typography>
              <Typography variant="body2"><strong>Delivery Status: </strong>{order.deliveryStatus}</Typography>
              <Typography variant="body2"><strong>Total Items: </strong>{order?.orderItems.length}</Typography>
              <Typography variant="body2"><strong>Order Total: </strong>Rs.{order.Total}</Typography>
            </CardContent>
          </Card>
          <Divider />

          {/* Tracking Details */}
          <Typography variant="h6" gutterBottom mt={2} sx={{ fontWeight: "bolder" }}>Tracking Details</Typography>
          <Card sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            cursor: "pointer",
            backgroundColor: "#F0F0F0",
            maxHeight: "100%", boxShadow: "none"

          }}>
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                image={`https://ayru-jaipur.s3.amazonaws.com/${order?.imageurl}`}
                alt="Tracking Image"
                sx={{
                  objectFit: 'fit',
                  height: "120px",
                  width: "100px",
                  padding: "10px",
                  borderRadius: "0px"
                }}
              />
            </Box>
            <CardContent sx={{ flexGrow: 1, padding: "12px", '&:last-child': { paddingBottom: "10px", position: "relative" } }}>
              <Typography variant="body2"><strong>Courier Name: </strong>{order.couriername}</Typography>
              <Box display="flex" alignItems="center">
                {order?.trekkingId1 && (
                  <>
                    <Typography variant="body2"><strong>Tracking Number: </strong>{order.trekkingId1}</Typography>
                    <Tooltip title="Copy to clipboard">
                      <IconButton size="small" onClick={() => copyToClipboard(order.trekkingId1)}>
                        <FileCopyOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                )
                }
              </Box>

              {order?.trekkingId2 && (
                <Box display="flex" alignItems="center">
                  <Typography variant="body2"><strong>Tracking Number: </strong>{order.trekkingId2}</Typography>
                  <Tooltip title="Copy to clipboard">
                    <IconButton size="small" onClick={() => copyToClipboard(order.trekkingId2)}>
                      <FileCopyOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

              <Typography variant="body2"><strong>Courier Name: </strong>{order.couriername}</Typography>

              <Typography variant="body2">
                <strong>Tracking Link: </strong>
                <a href={order.trekkinglink} target="_blank" rel="noopener noreferrer">
                  {order.trekkinglink}
                </a>
              </Typography>
            </CardContent>
          </Card>
          <Accordion defaultExpanded style={{ backgroundColor: "whitesmoke" }}>
            <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
              <Typography>Order Summary ({order?.orderItems.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {order?.orderItems.length !== 0 && (
                <>
                  <Grid container spacing={1} pl={1} pr={1}>
                    {order?.orderItems.map((item) => (
                      <Grid item key={item.id} xs={12} sm={12} md={12} lg={12} sx={{ height: "auto", marginBottom: "5px" }}>
                        <Card sx={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'row',
                          height: '100%',
                          cursor: "pointer",
                          backgroundColor: "#F0F0F0",
                          maxHeight: "100%",
                        }}>
                          <Box sx={{ position: 'relative' }}>
                            <Chip
                              label={<div style={{ textAlign: 'center' }}>
                                <Typography variant="caption" component="span" sx={{ lineHeight: 1, fontWeight: "bolder" }}>
                                  {item?.quantity}
                                </Typography>
                              </div>}
                              color="secondary"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                zIndex: 1,
                                padding: '4px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: '20px',
                                width: '20px',
                                borderRadius: '50%',
                                fontSize: '2px',
                                fontWeight: 'bold',
                              }}
                            />
                            <CardMedia
                              component="img"
                              image={`https://ayru-jaipur.s3.amazonaws.com/${item?.inventory?.Media[0]?.url}`}
                              alt={item.inventory.productName}
                              onClick={() => router.push(`/shop/${item?.inventory?.id}`)}
                              sx={{
                                objectFit: 'fit',
                                height: "130px",
                                width: "110px",
                                padding: "10px",
                                borderRadius: "0px"
                              }}
                            />
                          </Box>
                          <CardContent sx={{ flexGrow: 1, padding: "12px", '&:last-child': { paddingBottom: "10px", position: "relative" } }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ lineHeight: "1", fontWeight: "bolder" }}>
                              {item?.inventory?.productName}
                            </Typography>
                            <Typography variant="body2" gutterBottom sx={{ lineHeight: "1", fontSize: "0.6em" }}>
                              <strong>SKU: </strong>{item?.inventory?.skuId}
                            </Typography>
                            {item?.sizeOption === "flat" && (
                              <Typography variant="subtitle2" gutterBottom sx={{ lineHeight: "1", fontWeight: "400" }}>
                                {item?.selectedFlatItem}
                              </Typography>
                            )}
                            {item?.sizeOption === "fitted" && (
                              <Typography variant="subtitle2" gutterBottom sx={{ lineHeight: "1", fontWeight: "400" }}>
                                {item?.selectedFittedItem}
                              </Typography>
                            )}
                            {item?.sizeOption === "custom" && (
                              <>
                                <Typography variant="subtitle2" gutterBottom sx={{ lineHeight: "1", fontWeight: "400" }}>
                                  {`${item?.selectedCustomFittedItem}`}
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom sx={{ lineHeight: "1", fontWeight: "600", fontSize: "10px" }}>
                                  {`L×W×H =  ${item?.length}×${item?.width}×${item?.height} ${item?.unit}`}
                                </Typography>
                              </>
                            )}


                            <Typography variant="body2" gutterBottom sx={{ lineHeight: "1", fontSize: "0.55em" }}>
                              <strong>SKU: </strong>{item?.inventory?.skuId}
                            </Typography>
                            {item?.discountedPrice ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ textDecoration: 'line-through', fontSize: "0.7em" }}>
                                  Rs.{item?.sellingPrice}
                                </Typography>
                                <Typography variant="body2" color={theme?.palette?.text?.contrastText} sx={{ fontSize: "0.7em" }}>
                                  Rs.{item?.discountedPrice}
                                </Typography>
                                <Typography variant="body2" color="error" sx={{
                                  background: 'inherit',
                                  color: "black", fontSize: "0.7em"
                                }}>
                                  {`(${Math.round(((item?.sellingPrice - item?.discountedPrice) / item?.sellingPrice) * 100)}% OFF)`}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" sx={{ fontSize: "0.7em" }}>
                                Rs.{item?.sellingPrice}
                              </Typography>
                            )}
                            <Grid container justifyContent="space-between" alignItems="flex-start" style={{ position: "absolute", bottom: "3px", width: "100%", overflow: "hidden", paddingRight: "20px" }}>
                              <Grid item>
                                <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "12px" }}>
                                  {`🛒 QTY: ${item?.quantity || 0} × ₹${item?.discountedPrice ? item?.discountedPrice : item?.sellingPrice} =`}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "12px" }}>
                                  {`₹${(item?.quantity * (item?.discountedPrice || item?.sellingPrice)).toFixed(2)}`}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </AccordionDetails>
          </Accordion>
          {/* Shipping Address */}
          <Typography variant="h6" gutterBottom mt={2} sx={{ fontWeight: "bolder" }}>Shipping Address</Typography>
          <Card >
            <CardContent>
              <Typography variant="body2">
                <Typography variant="body2"><strong>Name: </strong>{order?.shippingAddress?.userName}</Typography>
                <Typography variant="body2"><strong>Phone No.: </strong>{order?.shippingAddress?.phoneNumber}</Typography>
                <Typography variant="body2"><strong>Alternate Phone No.: </strong>{order?.shippingAddress?.alternateMobileNumber}</Typography>
                <strong>Shipping Address: </strong>
                {order.shippingAddress && `${order.shippingAddress.addressLine1}, ${order.shippingAddress.addressLine2 ? `${order.shippingAddress.addressLine2}, ` : ''}${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.pincode}, ${order.shippingAddress.country}`}
              </Typography>
            </CardContent>
          </Card>

        </>
      )}
    </Container>
  );
};

export default OrderDetails;
