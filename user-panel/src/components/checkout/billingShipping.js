"use client"
import React, { useState, useEffect } from 'react';
import { Box, Button, Stepper, Step, StepLabel, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, TextField, Checkbox, FormControlLabel, useTheme, useMediaQuery, Divider, Grid, Card, CardContent, CardMedia, Chip, IconButton, MenuItem } from '@mui/material';
import { Close, DeleteForever, Edit } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '@/contexts/auth';
import api from '../../../api';
import { styled } from '@mui/material/styles';
import axios from 'axios';

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



export const BillingAndShippingStep = ({ user, onLogin, handleNext, cartItems, Totalcount, orderData, setOrderData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user: currentUser } = useAuth();

  const [extraNote, setExtraNote] = useState(orderData?.extraNote || '');

  const handleExtraNoteChange = (event) => {
    setExtraNote(event.target.value);
    setOrderData({
      extraNote: event.target.value,
    });
  };

  // const [orderData, setOrderData] = useState({
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   phoneNumber: '',
  //   alternateMobileNumber: '',
  //   addressLine1: '',
  //   addressLine2: '',
  //   pincode: '',
  //   city: '',
  //   state: '',
  //   country: '',
  // });

  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setOrderData({
        firstName: currentUser.firstName || orderData?.firstName,
        lastName: currentUser.lastName || orderData?.lastName,
        email: currentUser.email || orderData?.email,
        phoneNumber: currentUser.phoneNumber || orderData?.phoneNumber,
        alternateMobileNumber: orderData?.alternateMobileNumber,
        addressLine1: currentUser.address1 || orderData?.address1,
        addressLine2: currentUser.address2 || orderData?.address2,
        pincode: currentUser.pincode || orderData?.pincode,
        city: currentUser.city || orderData?.city,
        state: currentUser.state || orderData?.state,
        country: currentUser.country || orderData?.country,
      });
    }

    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries/states');
        setCountries(response.data.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, [currentUser]);

  useEffect(() => {
    if (orderData.country) {
      const selectedCountry = countries.find(country => country.name === orderData.country);
      if (selectedCountry) {
        setStates(selectedCountry.states);
      }
    }
  }, [orderData.country, countries]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // setOrderData((prevState) => ({
    //   ...prevState,
    //   [name]: value,
    // }));
    setOrderData({
      [name]: value,
    });
  };
  return (
    <>
      <Paper sx={{ p: 1, backgroundColor: "transparent", boxShadow: "none" }} mt={2}>
        {user ? (
          <>
            <Accordion style={{ backgroundColor: "whitesmoke" }} >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Order Summary ({cartItems.length})</Typography>
              </AccordionSummary>
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
                                image={`https://ayru-jaipur.s3.amazonaws.com/${item?.Inventory?.Media[0]?.url}`}
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
                              <Typography variant="subtitle2" gutterBottom sx={{ lineHeight: "1", fontWeight: "bolder", fontSize: "12px" }}>
                                {item?.Inventory?.productName}
                              </Typography>
                              {/* <Typography variant="body2" gutterBottom sx={{ lineHeight: "1", fontSize: "0.6em" }}>
                                <strong>SKU: </strong>{item?.Inventory?.skuId}
                              </Typography> */}
                              {item?.sizeOption === "flat" && (
                                <Typography variant="subtitle2" gutterBottom sx={{ lineHeight: "1.2", fontWeight: "400", fontSize: "10px" }}>
                                  {item?.selectedFlatItem}
                                </Typography>
                              )}
                              {item?.sizeOption === "fitted" && (
                                <Typography variant="subtitle2" gutterBottom sx={{ lineHeight: "1.2", fontWeight: "400", fontSize: "10px" }}>
                                  {item?.selectedFittedItem}
                                </Typography>
                              )}
                              {item?.sizeOption === "custom" && (
                                <>
                                  <Typography variant="subtitle2" gutterBottom sx={{ lineHeight: "1.2", fontWeight: "400", fontSize: "10px" }}>
                                    {`${item?.selectedCustomFittedItem}`}
                                  </Typography>
                                  <Typography variant="subtitle2" gutterBottom sx={{ lineHeight: "1.2", fontWeight: "600", fontSize: "9px" }}>
                                    {`Fitted Size L×W×H =  ${item?.length}×${item?.width}×${item?.height} ${item?.unit}`}
                                  </Typography>
                                </>
                              )}
                              <Grid container justifyContent="space-between" alignItems="flex-start" style={{ position: "absolute", bottom: "1px", width: "100%", overflow: "hidden", paddingRight: "20px" }}>
                                <Grid item>
                                  <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "10px" }}>
                                    {`QTY: ${item?.quantity || 0} × ₹${item?.Inventory?.discountedPrice ? item?.Inventory?.discountedPrice : item?.Inventory?.sellingPrice} =`}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "10px" }}>
                                    {`₹${(item?.quantity * (item?.Inventory?.discountedPrice || item?.Inventory?.sellingPrice)).toFixed(2)}`}
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
                        {`₹${Totalcount.toFixed(2)}`}
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
                        {`₹${Totalcount.toFixed(2)}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />
            <Grid container spacing={isMobile ? 0 : 1}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.phoneNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Alternate Mobile Number"
                  name="alternateMobileNumber"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.alternateMobileNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Country"
                  name="country"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.country}
                  onChange={handleInputChange}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.name} value={country.name}>
                      {country.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="State"
                  name="state"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.state}
                  onChange={handleInputChange}
                >
                  {states.map((state) => (
                    <MenuItem key={state.name} value={state.name}>
                      {state.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="City"
                  name="city"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Pincode"
                  name="pincode"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.pincode}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Address Line 1"
                  name="addressLine1"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.addressLine1}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Address Line 2"
                  name="addressLine2"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.addressLine2}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Typography mt={2} mb={1} variant="h6">
              {/* 🗒  */}
              Special Instructions for Seller</Typography>
            <Box>
              <TextField
                label="How can we help you?"
                multiline
                rows={4}
                fullWidth
                value={orderData?.extraNote}
                onChange={handleExtraNoteChange}
                variant="outlined"
                sx={{ backgroundColor: '#fff' }}
              />
            </Box>
            <ShippingInfoBox>
              <Typography variant="body2">
                {/* <CircleWrapper>
              <InnerCircle />
            </CircleWrapper> */}
                {/* 🚚  */}
                <strong>Standard Shipping</strong>
              </Typography>
              <Typography variant="body2" style={{ color: theme.palette.primary.contrastText }}>
                Your order will be dispatched within 2 days. Thank you for your patience! 😊
              </Typography>
            </ShippingInfoBox>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <Button fullWidth variant="contained" color="primary" onClick={handleNext}>
                Continue ➡️
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h6">Please log in to proceed. 🔒</Typography>
            <Button fullWidth variant="contained" color="primary" onClick={onLogin} sx={{ marginTop: 2 }}>
              Log In 🔑
            </Button>
          </>
        )}
      </Paper>
    </>
  );
};
