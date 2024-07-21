"use client"
import React, { useState, useEffect } from 'react';
import { Box, Button, Divider, Stepper, Step, StepLabel, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Grid, TextField, Checkbox, FormControlLabel, useTheme, useMediaQuery, Card, Chip, CardMedia, CardContent, styled } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '@/contexts/auth';
import { ExpandMoreSharp } from '@mui/icons-material';

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
export const ReviewAndConfirmStep = ({ user, onLogin, handleNext, cartItems, Totalcount, orderData, setOrderData }) => {
  const theme = useTheme();

  return (
    <>
      <Paper sx={{ p: 2, backgroundColor: "transparent", boxShadow: "none" }}>
        <Typography variant="h6">Review and Confirm</Typography>
        <Accordion defaultExpanded style={{ backgroundColor: "whitesmoke" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Order Summary ({cartItems.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {cartItems.length !== 0 && (
              <>
                <Grid container spacing={1} pl={1} pr={1}>
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
                          <Typography variant="subtitle2" gutterBottom sx={{ lineHeight: "1", fontWeight: "bolder" }}>
                            {item?.Inventory?.productName}
                          </Typography>
                          <Typography variant="body2" gutterBottom sx={{ lineHeight: "1", fontSize: "0.6em" }}>
                            <strong>SKU: </strong>{item?.Inventory?.skuId}
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
                          <Grid container justifyContent="space-between" alignItems="flex-start" style={{ position: "absolute", bottom: "3px", width: "100%", overflow: "hidden", paddingRight: "20px" }}>
                            <Grid item>
                              <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "12px" }}>
                                {`🛒 QTY: ${item?.quantity || 0} × ₹${item?.Inventory?.discountedPrice ? item?.Inventory?.discountedPrice : item?.Inventory?.sellingPrice} =`}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "12px" }}>
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
        <Accordion defaultExpanded style={{ backgroundColor: "#fff" }}>
          <AccordionSummary expandIcon={<ExpandMoreSharp />} mb={0}>
            <Typography>Shipping Details</Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails style={{ paddingTop: "0px" }}>
            <ShippingDetailsBox>
              <Typography variant="body2"><strong>First Name:</strong> {orderData?.firstName || 'N/A'}</Typography>
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
              <Typography variant="body2"><strong>Seller Instructions:</strong> {orderData?.extraNote || 'N/A'}</Typography>
            </ShippingDetailsBox>
          </AccordionDetails>
        </Accordion>
        {/* <Button>Place Order</Button> */}

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
        </Box>
      </Paper>

      <Button variant='contained' onClick={handleNext} sx={{ width: "100%" }}>
        Place Order
      </Button>
    </>
  );
};