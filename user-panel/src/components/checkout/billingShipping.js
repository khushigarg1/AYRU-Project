"use client"
import React, { useState, useEffect } from 'react';
import { Box, Button, Stepper, Step, StepLabel, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, TextField, Checkbox, FormControlLabel, useTheme, useMediaQuery, Divider, Grid, Card, CardContent, CardMedia, Chip, IconButton, MenuItem, Snackbar, Alert, Autocomplete } from '@mui/material';
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
  const [snackbar, setSnackbar] = useState(false);
  const [extraNote, setExtraNote] = useState(orderData?.remark || '');
  const [errors, setErrors] = useState({});
  // console.log("orderdaat1", orderData);

  const handleContinue = () => {
    const newErrors = {};

    if (!orderData.firstName) newErrors.firstName = 'This field is mandatory';
    if (!orderData.lastName) newErrors.lastName = 'This field is mandatory';
    if (!orderData.email) newErrors.email = 'This field is mandatory';
    if (!orderData.phoneNumber) newErrors.phoneNumber = 'This field is mandatory';
    if (!orderData.country) newErrors.country = 'This field is mandatory';
    if (!orderData.state) newErrors.state = 'This field is mandatory';
    if (!orderData.city) newErrors.city = 'This field is mandatory';
    if (!orderData.pincode) newErrors.pincode = 'This field is mandatory';
    if (!orderData.addressLine1) newErrors.addressLine1 = 'This field is mandatory';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      validateFields();
    } else {
      setSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(false);
  };
  const handleExtraNoteChange = (event) => {
    setExtraNote(event.target.value);
    setOrderData({
      remark: event.target.value,
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
        firstName: orderData?.firstName,
        lastName: orderData?.lastName,
        email: currentUser.email || orderData?.email,
        phoneNumber: orderData?.phoneNumber,
        alternateMobileNumber: orderData?.alternateMobileNumber,
        addressLine1: orderData?.addressLine1,
        addressLine2: orderData?.addressLine2,
        pincode: orderData?.pincode,
        city: orderData?.city,
        state: orderData?.state,
        country: orderData?.country,
        // firstName: currentUser.firstName || orderData?.firstName,
        // lastName: currentUser.lastName || orderData?.lastName,
        // email: currentUser.email || orderData?.email,
        // phoneNumber: currentUser.phoneNumber || orderData?.phoneNumber,
        // alternateMobileNumber: orderData?.alternateMobileNumber,
        // addressLine1: currentUser.address1 || orderData?.address1,
        // addressLine2: currentUser.address2 || orderData?.address2,
        // pincode: currentUser.pincode || orderData?.pincode,
        // city: currentUser.city || orderData?.city,
        // state: currentUser.state || orderData?.state,
        // country: currentUser.country || orderData?.country,
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
  const validateFields = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phoneNumber', 'country', 'state', 'city', 'pincode'
    ];

    for (let field of requiredFields) {
      if (!orderData[field] || orderData[field].trim() === '') {
        setSnackbar(true);
        return false;
      }
    }

    handleNext();
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
                              <Typography variant="body1" gutterBottom sx={{ lineHeight: "1", fontWeight: "bolder", fontSize: "12px" }}>
                                {item?.Inventory?.productName}
                              </Typography>
                              {/* <Typography variant="body2" gutterBottom sx={{ lineHeight: "1", fontSize: "0.6em" }}>
                                <strong>SKU: </strong>{item?.Inventory?.skuId}
                              </Typography> */}
                              {item?.sizeOption === "flat" && (
                                <Typography variant="body1" gutterBottom sx={{ lineHeight: "1.2", fontWeight: "400", fontSize: "10px" }}>
                                  {item?.selectedFlatItem}
                                </Typography>
                              )}
                              {item?.sizeOption === "fitted" && (
                                <Typography variant="body1" gutterBottom sx={{ lineHeight: "1.2", fontWeight: "400", fontSize: "10px" }}>
                                  {item?.selectedFittedItem}
                                </Typography>
                              )}
                              {item?.sizeOption === "custom" && (
                                <>
                                  <Typography variant="body1" gutterBottom sx={{ lineHeight: "1.2", fontWeight: "400", fontSize: "10px" }}>
                                    {`${item?.selectedCustomFittedItem}`}
                                  </Typography>
                                  <Typography variant="body1" gutterBottom sx={{ lineHeight: "1.2", fontWeight: "600", fontSize: "9px" }}>
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
            <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />

            <Typography mt={2} mb={1} variant="h6">
              Shipping Address
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  label="First Name"
                  name="firstName"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.firstName}
                  onChange={handleInputChange}
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  label="Last Name"
                  name="lastName"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.lastName}
                  onChange={handleInputChange}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  label="Email"
                  name="email"
                  fullWidth
                  disabled
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.email}
                  onChange={handleInputChange}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  type='number'
                  label="Phone Number"
                  name="phoneNumber"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.phoneNumber}
                  onChange={handleInputChange}
                  error={Boolean(errors.phoneNumber)}
                  helperText={errors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  type='number'
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
                <Autocomplete
                  options={countries}
                  getOptionLabel={(option) => option.name || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      fullWidth
                      margin="normal" InputProps={{
                        ...params.InputProps,
                        sx: {
                          fontFamily: theme.palette.typography.fontFamily,
                        },
                      }}
                      sx={{ backgroundColor: 'white' }}
                      error={Boolean(errors.country)}
                      helperText={errors.country}
                    />
                  )}

                  renderOption={(props, option) => (
                    <li {...props} style={{ fontFamily: theme.palette.typography.fontFamily }}>
                      {option.name}
                    </li>
                  )}
                  ListboxProps={{
                    sx: {
                      fontFamily: theme.palette.typography.fontFamily,
                    },
                  }}
                  value={countries.find((country) => country.name === orderData.country) || null}
                  onChange={(event, newValue) => {
                    handleInputChange({ target: { name: 'country', value: newValue?.name || '' } });
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={states}
                  getOptionLabel={(option) => option.name || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      fullWidth
                      margin="normal" InputProps={{
                        ...params.InputProps,
                        sx: {
                          fontFamily: theme.palette.typography.fontFamily,
                        },
                      }}
                      sx={{ backgroundColor: 'white' }}
                      error={Boolean(errors.state)}
                      helperText={errors.state}
                    />
                  )}

                  renderOption={(props, option) => (
                    <li {...props} style={{ fontFamily: theme.palette.typography.fontFamily }}>
                      {option.name}
                    </li>
                  )}
                  ListboxProps={{
                    sx: {
                      fontFamily: theme.palette.typography.fontFamily,
                    },
                  }}
                  value={states.find((state) => state.name === orderData.state) || null}
                  onChange={(event, newValue) => {
                    handleInputChange({ target: { name: 'state', value: newValue?.name || '' } });
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  label="City"
                  name="city"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.city}
                  onChange={handleInputChange}
                  error={Boolean(errors.city)}
                  helperText={errors.city}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  label="Pincode"
                  name="pincode"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.pincode}
                  onChange={handleInputChange}
                  error={Boolean(errors.pincode)}
                  helperText={errors.pincode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  label="Address Line 1"
                  name="addressLine1"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.addressLine1}
                  onChange={handleInputChange}
                  error={Boolean(errors.addressLine1)}
                  helperText={errors.addressLine1}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  // required
                  label="Address Line 2"
                  name="addressLine2"
                  fullWidth
                  margin="normal"
                  sx={{ backgroundColor: 'white' }}
                  value={orderData.addressLine2}
                  onChange={handleInputChange}
                // error={Boolean(errors.addressLine2)}
                // helperText={errors.addressLine2}
                />
              </Grid>
            </Grid>
            <Typography mt={2} mb={1} variant="h6">
              Special Instructions for Seller (optional)
            </Typography>
            <Box>
              <TextField
                label="How can we help you?"
                multiline
                rows={4}
                fullWidth
                value={orderData?.remark}
                onChange={handleExtraNoteChange}
                variant="outlined"
                sx={{ backgroundColor: '#fff' }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <Button fullWidth variant="contained" color="primary" onClick={handleContinue}>
                Continue ➡️
              </Button>
            </Box>
            {/* <ShippingInfoBox>
              <Typography variant="body2">
                <strong>Standard Shipping</strong>
              </Typography>
              <Typography variant="body2" style={{ color: theme.palette.primary.contrastText }}>
                Your order will be dispatched within 2 days. Thank you for your patience! 😊
              </Typography>
            </ShippingInfoBox> */}
          </>
        ) : (
          <>
            <Typography variant="h6">Please log in to proceed. 🔒</Typography>
            <Button fullWidth variant="contained" color="primary" onClick={onLogin} sx={{ marginTop: 2 }}>
              Log In 🔑
            </Button>
          </>
        )}
        {snackbar && !errors &&
          <Snackbar open={snackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
              Please fill all required fields!!!
            </Alert>
          </Snackbar>
        }
      </Paper>
    </>
  );
};
