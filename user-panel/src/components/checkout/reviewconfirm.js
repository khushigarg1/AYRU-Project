"use client"
import React, { useState, useEffect } from 'react';
import { Box, Button, Divider, Stepper, Step, StepLabel, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Grid, TextField, Checkbox, FormControlLabel, useTheme, useMediaQuery, Card, Chip, CardMedia, CardContent, styled, Modal, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '@/contexts/auth';
import { Close, ExpandMoreSharp } from '@mui/icons-material';
import api from '../../../api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import RajorPay from "../../../public/images/razorpay.png";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';
import CircularProgress from '@mui/material/CircularProgress';


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};


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
export const ReviewAndConfirmStep = ({ user, onLogin, handleNext, handleBack, cartItems, Totalcount, orderData, setOrderData }) => {
  const theme = useTheme();
  const token = Cookies.get("token");
  const router = useRouter();


  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [placeOrderDisabled, setPlaceOrderDisabled] = useState(false);
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);

  // console.log("orderdaat2", orderData);

  const handleOrder = async () => {
    const finalData = {
      ...orderData,
      phoneNumber: orderData?.countrycode + '-' + orderData?.phoneNumber
    }
    delete finalData.countrycode;
    console.log("final", finalData);

    setPlaceOrderLoading(true);
    try {
      if (token) {
        const response = await api.post(`/order?token=${token}`, finalData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const paymentUrl = response?.data?.newPayment?.short_url;
        if (paymentUrl) {
          router.push(paymentUrl);
        }
        // const cartItemsData = response.data.data?.userCart;
        // setCartCount(cartItemsData.length);
        // const cartMap = cartItemsData.reduce((acc, cartItem) => {
        //   acc[cartItem.inventoryId] = cartItem.id;
        //   return acc;
        // }, {});
        // setcartItems(cartMap);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setPlaceOrderLoading(false);
      setPlaceOrderDisabled(true);
      setOpen(true);

    }
  };
  return (
    <>
      <Paper sx={{ p: 1, backgroundColor: "transparent", boxShadow: "none" }}>
        <Typography variant="h6">Review and Confirm</Typography>
        <Accordion style={{ backgroundColor: "whitesmoke" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Order Summary ({cartItems.length})</Typography>
          </AccordionSummary>


          <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
              <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 4, right: 4 }}>
                <Close />
              </IconButton>

              <Typography id="request-availability-modal-title" variant="h5" sx={{ lineHeight: 1.2, textAlign: "center" }} mb={1}>
                Invalid Details
              </Typography>
              <Divider />
              <Typography variant='body2' id="request-availability-modal-description" sx={{ mt: 2, lineHeight: 1.2 }}>
                There is some issue with the details you shared.
                Please make Sure that the phone number is correct and try again.
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  sx={{ mr: 2 }}
                  fullWidth
                >
                  Proceed to Edit Details...
                </Button>
              </Box>
            </Box>
          </Modal>
          <AccordionDetails>
            {cartItems.length !== 0 && (
              <>
                <Grid container spacing={1} pl={0} pr={0}>
                  {cartItems.map((item) => (
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
                            image={`https://ayrujaipur.s3.amazonaws.com/${item?.Inventory?.Media[0]?.url}`}
                            alt={item.Inventory.productName}
                            onClick={() => router.push(`/shop/${item?.Inventory?.id}`)}
                            sx={{
                              objectFit: 'fit',
                              height: "100px",
                              width: "90px",
                              padding: "10px",
                              borderRadius: "0px"
                            }}
                          />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, padding: "12px", '&:last-child': { paddingBottom: "10px", position: "relative" } }}>
                          <Typography variant="body1" gutterBottom sx={{ lineHeight: "1.2", fontWeight: "bolder", fontSize: "12px", fontWeight: "bold" }}>
                            {item?.Inventory?.productName}
                          </Typography>
                          {/* <Typography variant="body2" gutterBottom sx={{ lineHeight: "1", fontSize: "0.6em" }}>
                            <strong>SKU: </strong>{item?.Inventory?.skuId}
                          </Typography> */}
                          {item?.sizeOption === "flat" && (
                            <Typography variant="body1" gutterBottom sx={{ lineHeight: "1.2", fontWeight: "400", fontSize: "10px", fontWeight: "bold" }}>
                              {item?.selectedFlatItem}
                            </Typography>
                          )}
                          {item?.sizeOption === "fitted" && (
                            <Typography variant="body1" gutterBottom sx={{ lineHeight: "1.2", fontWeight: "400", fontSize: "10px", fontWeight: "bold" }}>
                              {item?.selectedFittedItem}
                            </Typography>
                          )}
                          {item?.sizeOption === "custom" && (
                            <>
                              <Typography variant="body1" gutterBottom sx={{ lineHeight: "1.2", fontWeight: "400", fontSize: "10px", fontWeight: "bold" }}>
                                {`${item?.selectedCustomFittedItem}`}
                              </Typography>
                              <Typography variant="body1" gutterBottom sx={{ lineHeight: "1.2", fontWeight: "600", fontSize: "10px", fontWeight: "bold" }}>
                                {`Fitted Size L×W×H =  ${item?.length}×${item?.width}×${item?.height} ${item?.unit}`}
                              </Typography>
                            </>
                          )}
                          <Grid container justifyContent="space-between" alignItems="flex-start" style={{ position: "absolute", bottom: "1px", width: "100%", overflow: "hidden", paddingRight: "20px" }}>
                            <Grid item>
                              <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "10px" }}>
                                {`QTY: ${item?.quantity || 0} × ₹${item?.cartSizeItem?.discountedPrice ? item?.cartSizeItem?.discountedPrice : item?.cartSizeItem?.sellingPrice} =`}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "10px" }}>
                                {`₹${(item?.quantity * (item?.cartSizeItem?.discountedPrice || item?.cartSizeItem?.sellingPrice))}`}
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
            <Divider sx={{ borderStyle: "dotted", marginTop: "12px", marginBottom: "12px", paddingLeft: "10px", paddingRight: "10px" }} />
            <Grid container justifyContent="space-between" alignItems="flex-start" style={{ padding: "0px 5px" }}>
              <Grid container justifyContent="space-between" alignItems="flex-start" style={{ padding: "0px 5px" }}>
                <Grid item>
                  <Typography variant='h5' style={{ fontWeight: "bolder", color: "black", fontSize: "0.8rem", marginRight: "10px" }}>
                    SUBTOTAL:
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='h5' style={{ fontWeight: "bolder", color: "black", fontSize: "0.8rem" }}>
                    {`₹${Totalcount}`}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between" alignItems="flex-start" style={{ padding: "0px 5px" }}>
                <Grid item >
                  <Typography variant='h5' style={{ fontWeight: "bolder", color: "black", fontSize: "0.8rem", marginRight: "10px" }}>
                    SHIPPING:
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='h5' style={{ fontWeight: "bolder", color: "black", fontSize: "0.8rem" }}>
                    FREE
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Divider sx={{ borderStyle: "dotted", marginTop: "3px", marginBottom: "8px", paddingLeft: "10px", paddingRight: "10px" }} />
            <Grid container justifyContent="space-between" alignItems="flex-start" style={{ padding: "0px 5px" }}>
              <Grid container justifyContent="space-between" alignItems="flex-start" style={{ padding: "0px 5px" }}>
                <Grid item >
                  <Typography variant='h5' style={{ fontWeight: "bolder", color: "black", fontSize: "0.8rem", marginRight: "10px" }}>
                    TOTAL:
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='h5' style={{ fontWeight: "bolder", color: "black", fontSize: "0.8rem" }}>
                    {`₹${Totalcount}`}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded style={{ backgroundColor: "#fff" }}>
          <AccordionSummary expandIcon={<ExpandMoreSharp />} mb={0}>
            <Typography>Shipping Details</Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails style={{ paddingTop: "0px" }}>
            <ShippingDetailsBox>
              <Typography variant="body2">{`${orderData?.firstName} ${orderData?.lastName}`}</Typography>
              <Typography variant="body2">{orderData?.addressLine1}</Typography>
              <Typography variant="body2">{orderData?.addressLine2}</Typography>
              <Typography variant="body2">{orderData?.city}, {orderData?.state}</Typography>
              <Typography variant="body2">{orderData?.country}</Typography>
              <Typography variant="body2">Pin: {orderData?.pincode}</Typography>
              <Typography variant="body2">Mobile Number: {orderData?.countrycode}{orderData?.phoneNumber}</Typography>
              {orderData.alternateMobileNumber &&
                <Typography variant="body2">Alternate Mobile Number: {orderData?.alternateMobileNumber}</Typography>
              }
              <Typography variant="body2">{orderData?.email}</Typography>
              <Typography variant="body2"><strong>Seller Instructions:</strong> {orderData?.remark || 'N/A'}</Typography>
              {/* <Typography variant="body2"><strong>First Name:</strong> {orderData?.firstName || 'N/A'}</Typography>
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
              <Typography variant="body2"><strong>Seller Instructions:</strong> {orderData?.extraNote || 'N/A'}</Typography> */}
            </ShippingDetailsBox>
          </AccordionDetails>
        </Accordion>
        {/* <Button>Place Order</Button> */}

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
            <Image alt="rajorpay" src={RajorPay}></Image>
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
        <Typography variant="h6">Pricing Details</Typography>
        <Box style={{ backgroundColor: "#fff" }} p={2}>
          <Grid container justifyContent="space-between" alignItems="flex-start" style={{ padding: "0px 5px" }}>
            <Grid container justifyContent="space-between" alignItems="flex-start" style={{ padding: "0px 5px" }}>
              <Grid item>
                <Typography variant='h5' style={{ fontWeight: "bolder", color: "black", fontSize: "0.8rem", marginRight: "10px" }}>
                  SUBTOTAL:
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='h5' style={{ fontWeight: "bolder", color: "black", fontSize: "0.8rem" }}>
                  {`₹${Totalcount}`}
                </Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between" alignItems="flex-start" style={{ padding: "0px 5px" }}>
              <Grid item >
                <Typography variant='h5' style={{ fontWeight: "bolder", color: "black", fontSize: "0.8rem", marginRight: "10px" }}>
                  SHIPPING:
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='h5' style={{ fontWeight: "bolder", color: "black", fontSize: "0.8rem" }}>
                  FREE
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ borderStyle: "dotted", marginTop: "3px", marginBottom: "8px", paddingLeft: "10px", paddingRight: "10px" }} />
          <Grid container justifyContent="space-between" alignItems="flex-start" style={{ padding: "0px 5px" }}>
            <Grid container justifyContent="space-between" alignItems="flex-start" style={{ padding: "0px 5px" }}>
              <Grid item >
                <Typography variant='h5' style={{ fontWeight: "bolder", color: "black", fontSize: "0.8rem", marginRight: "10px" }}>
                  TOTAL:
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='h5' style={{ fontWeight: "bolder", color: "black", fontSize: "0.8rem" }}>
                  {`₹${Totalcount}`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Box>

      </Paper>

      <Button variant='contained' disabled={placeOrderLoading || placeOrderDisabled} onClick={handleOrder} sx={{ width: "100%" }} >
        {placeOrderLoading ? <CircularProgress color='inherit' size={24} /> :
          "Place Order"
        }
      </Button>
    </>
  );
}; 