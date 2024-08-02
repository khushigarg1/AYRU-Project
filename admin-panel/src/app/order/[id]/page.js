"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Box,
  Divider,
  TableContainer,
  TableCell,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableFooter,
  Card,
  Chip,
  CardMedia,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import api from '@/api';
import Cookies from 'js-cookie';
import TrekkingDetails from '@/src/components/order/trekkingDetail';
import { useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';

const OrderAccordion = ({ params }) => {
  const { id } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const printRef = useRef();
  const print2Ref = useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Order Summary',
  });
  const handlePrint2 = useReactToPrint({
    content: () => print2Ref.current,
    documentTitle: 'Order Bill',
  });

  useEffect(() => {
    const getOrder = async () => {
      const admintoken = Cookies.get("admintoken");
      api.defaults.headers.Authorization = `Bearer ${admintoken}`;
      try {
        const response = await api.get(`/order/admin/${id}`);
        setOrder(response?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    }
    getOrder();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  const getTotalQuantity = () => {
    return order?.orderItems.reduce((total, item) => total + item.quantity, 0);
  };
  return (
    <div>
      {/* <Button
        onClick={() => router.push(`/order/summary/${order?.id}`)}
      >Go for print</Button> */}

      <Accordion defaultExpanded key={order?.id}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Order ID: {order?.orderid}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TrekkingDetails order={order} />
        </AccordionDetails>
      </Accordion>

      <Accordion key={order?.id}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Order Items Details</Typography>
        </AccordionSummary>
        <AccordionDetails>

          {order?.orderItems.length !== 0 &&
            <>
              <Box>
                <Typography variant='body1' gutterBottom style={{ fontWeight: "bold", alignItems: "center", justifyContent: "center", paddingLeft: "1em" }}>
                  Total Items : {order?.orderItems.length}
                </Typography>
                <Divider />
              </Box>
              <Grid container spacing={1} pl={1} mt={1} pr={1}>
                {order?.orderItems?.map((item) => (
                  <>
                    <Grid item key={item.id} xs={12} sm={12} md={12} lg={12} sx={{ height: "auto", marginBottom: "5px" }}>
                      <Card sx={{
                        position: 'relative',
                        display: 'flex', flexDirection: 'row', height: '100%', cursor: "pointer",
                        maxHeight: "100%",
                        padding: "15px 5px"

                      }}

                        onClick={() => router.push(`/inventory/${item?.inventory?.id}`)}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <Chip
                            label={
                              <div style={{ textAlign: 'center' }}>
                                <Typography variant="caption" component="span" sx={{ lineHeight: 1, fontWeight: "bolder" }}>
                                  {item?.quantity}
                                  {/* {`${((item.sellingPrice - item.discountedPrice) / item.sellingPrice * 100).toFixed(0)}%`} */}
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
                            // height="100"
                            image={`https://ayru-jaipur.s3.amazonaws.com/${item?.inventory?.Media[0]?.url}`}
                            alt={item.inventory.productName}
                            // onClick={() => router.push(`/shop/${item?.inventory?.id}`)}
                            sx={{
                              objectFit: 'fit',
                              height: "130px",
                              width: "110px",
                              // maxHeight: "100%",
                              // maxWidth: "100%",
                              padding: "5px",
                              borderRadius: "0px"
                            }}
                          />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, padding: "12px", '&:last-child': { paddingBottom: "10px", position: "relative" }, paddingTop: "0px" }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ lineHeight: "1", fontWeight: "bolder" }}>
                            {item?.inventory?.productName}
                          </Typography>
                          {item?.sizeOption === "flat" &&
                            <Typography variant="subtitle2" gutterBottom sx={{ fontSize: "0.7em", lineHeight: "1", fontWeight: "400" }}>
                              {item?.selectedFlatItem}
                            </Typography>
                          }
                          {item?.sizeOption === "fitted" &&
                            <Typography variant="subtitle2" gutterBottom sx={{ fontSize: "0.7em", lineHeight: "1", fontWeight: "400" }}>
                              {item?.selectedFittedItem}
                            </Typography>
                          }
                          {item?.sizeOption === "custom" && (
                            <>
                              <Typography variant="subtitle2" gutterBottom sx={{ fontSize: "0.7em", lineHeight: "1", fontWeight: "400" }}>
                                {`${item?.selectedCustomFittedItem}`}
                              </Typography>
                              <Typography variant="subtitle2" gutterBottom sx={{ fontSize: "0.7em", lineHeight: "1", fontWeight: "600" }}>
                                {`L×W×H =  ${item?.length}×${item?.width}×${item?.height} ${item?.unit}`}
                              </Typography>
                            </>
                          )
                          }
                          {/* <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: "10px" }}>
                        <strong>Category: </strong>{item?.inventory?.Category?.categoryName}
                      </Typography> */}

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
                          <Typography variant='body2' sx={{ color: item?.inventory?.extraOptionOutOfStock ? 'red' : 'green', fontSize: "0.6em", marginBottom: "15px" }}>
                            {item?.inventory?.extraOptionOutOfStock === true || item?.quantity === 0 ? "Out of Stock" : "In Stock"}
                          </Typography>
                          <Typography variant='body2' sx={{ color: item?.inventory?.sale ? 'red' : 'green', fontSize: "0.6em", marginBottom: "15px" }}>
                            {item?.inventory?.sale === true || item?.quantity === 0 ? "Sale Item" : "not a sale item"}
                          </Typography>
                          {/* <Grid container justifyContent="space-between" alignItems="flex-start" style={{ position: "absolute", bottom: "3px", width: "100%", overflow: "hidden", paddingRight: "150px" }}
                      >
                        <Grid item>
                          <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "10px" }}>
                            {`QTY: ${item?.quantity || 0} × ₹${item?.inventory?.discountedPrice ? item?.inventory?.discountedPrice : item?.inventory?.sellingPrice} =`}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "10px" }}>
                            {`Rs. ${(item?.quantity * (item?.inventory?.discountedPrice || item?.inventory?.sellingPrice)).toFixed(2)}`}
                          </Typography>
                        </Grid>
                      </Grid> */}
                        </CardContent>

                        <Grid container justifyContent="space-between" alignItems="flex-start" style={{ position: "absolute", bottom: "3px", width: "100%", overflow: "hidden", paddingLeft: "120px", paddingRight: "15px" }}
                        >
                          <Grid item>
                            <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "10px" }}>
                              {`QTY: ${item?.quantity || 0} × ₹${item?.discountedPrice ? item?.discountedPrice : item?.sellingPrice} =`}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "10px" }}>
                              {`Rs. ${(item?.quantity * (item?.discountedPrice || item?.sellingPrice)).toFixed(2)}`}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                    <Divider mt={1} />
                  </>
                ))}
              </Grid>
              <Box
                style={{
                  marginTop: "2%",
                  backgroundColor: theme.palette.background.paper,
                  padding: "2%",
                  // borderRadius: "8px", // Add border radius for rounded corners
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  bottom: "0",
                  width: "100%",
                  position: !isMobile && "relative"
                }}
              >
                <Grid container justifyContent="space-between" alignItems="flex-start" style={{ padding: "0px 5px" }}>
                  <Grid item>
                    <Typography variant='h5' style={{ fontWeight: "bolder", color: "black", fontSize: "1.3rem" }}>
                      SUBTOTAL:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='h5' style={{ fontWeight: "bolder", color: "black", fontSize: "1.5rem" }}>
                      {`₹${order?.Total.toFixed(2)}`}
                      <Typography variant="body2" sx={{ fontSize: '0.55rem', color: 'text.secondary', mb: 1 }}>
                        (Price inclusive of all taxes)
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
              </Box >
            </>
          }
        </AccordionDetails>
      </Accordion>

      <Accordion key={order?.id}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Print Order Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrint}
              style={{ margin: '20px' }}
            >
              Print Order Summary
            </Button>
            <Paper style={{ padding: '20px', margin: '20px', backgroundColor: "#fff" }} ref={printRef}>
              <Grid container spacing={4}>
                <Grid item xs={8} mt={0}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }} mb={0}>
                    Ship to
                  </Typography>
                  <Typography variant="subtitle1">{order?.user?.firstName} {order?.user?.lastName}</Typography>
                  <Typography variant="body1">{order.shippingAddress.addressLine1}</Typography>
                  <Typography variant="body1">{order.shippingAddress.addressLine2}</Typography>
                  <Typography variant="body1">{order.shippingAddress.city}, {order.shippingAddress.state}</Typography>
                  <Typography variant="body1">{order.shippingAddress.country}</Typography>
                  <Typography variant="body1">Pin: {order.shippingAddress.pincode}</Typography>
                  <Typography variant="body1">Phone Number1: {order.shippingAddress.phoneNumber}</Typography>
                  {order.shippingAddress.alternateMobileNumber &&
                    <Typography variant="body1">Phone Number2: {order.shippingAddress.alternateMobileNumber}</Typography>
                  }
                </Grid>
                <Grid item xs={4} container direction="column" alignItems="center" justifyContent="center">
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 'bold', textAlign: 'right', alignSelf: 'flex-end', width: '100%' }}
                  >
                    Paid
                  </Typography>
                  <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }} mb={0}>Tracking Details</Typography>
                  <Box
                    border={1}
                    borderColor="grey.400"
                    width={200}
                    height={150}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography align="center" sx={{ fontWeight: 'bold' }}>Tracking Details</Typography>
                  </Box>
                </Grid>
                <Divider style={{ margin: '10px 0' }} />
                <Grid item xs={7} position="relative" mt={0}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }} mb={0}>Order ID: {order.orderid}</Typography>
                  {/* <Typography variant="body1">Order Id: {order.orderid}</Typography> */}
                  <Typography variant="body1"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</Typography>
                  <Typography variant="body1" align="left" mt={2}>
                    <strong>Note:</strong> (Unboxing Video is a must in case of any issues)
                  </Typography>
                  <Typography variant="body2" >www.ayrujaipur.in</Typography>
                </Grid>
                <Grid item xs={5}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }} mb={0}>Sold By</Typography>
                  <Typography variant="body2">Ayru Jaipur</Typography>
                  <Typography variant="body2">Prangan, 302012 Jaipur, Rajasthan, INDIA</Typography>
                  <Typography variant="body2">Contact Number: +91-97858 52222</Typography>
                  {/* <Typography variant="body2">Email: ayrujaipur@gmail.com</Typography>
                  <Typography variant="body2">Instagram: handblock_ayrujaipur</Typography>
                  <Typography variant="body2">
                    Operating Hours: +91-9785852222 between 11:00 AM and 5:00 PM, Monday to Saturday.
                  </Typography> */}
                </Grid>
              </Grid>
            </Paper>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion key={order?.id}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Print Bill</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            {order ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePrint2}
                  style={{ margin: '20px' }}
                >
                  Print Order bill
                </Button>
                <Paper style={{ padding: '20px', margin: '20px', backgroundColor: "#fff" }} ref={print2Ref}>
                  <Grid container spacing={2}>
                    <Grid item xs={8} mt={0}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }} mb={0}>
                        Ship to
                      </Typography>
                      <Typography variant="subtitle1">{order?.user?.firstName} {order?.user?.lastName}</Typography>
                      <Typography variant="body1">{order.shippingAddress.addressLine1}</Typography>
                      <Typography variant="body1">{order.shippingAddress.addressLine2}</Typography>
                      <Typography variant="body1">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.country}</Typography>
                      <Typography variant="body1">Pin: {order.shippingAddress.pincode}</Typography>
                      <Typography variant="body1">Phone Number1: {order.shippingAddress.phoneNumber}</Typography>
                      {order.shippingAddress.alternateMobileNumber &&
                        <Typography variant="body1">Phone Number2: {order.shippingAddress.alternateMobileNumber}</Typography>
                      }
                    </Grid>

                    <Grid item xs={4}>
                      <Typography variant="h6">Order Details</Typography>
                      <Typography variant="body2">Order Number: {order.orderid}</Typography>
                      <Typography variant="body2">Order Date: {new Date(order.createdAt).toLocaleDateString()}</Typography>
                      <Typography variant="body2">Payment Status: {order.paymentStatus}</Typography>
                      <Typography variant="body2">Total Items: {order?.orderItems.length}</Typography>
                      <Typography variant="body2">Total Quantity: {getTotalQuantity()}</Typography>
                      <Typography variant="body2">Paid Amount: {order.Total}</Typography>
                      <Typography variant="body2">Order Note: {order.remark || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider style={{ margin: '10px 0' }} />
                      <Typography variant="h6" sx={{ fontWeight: "bold" }} mb={0}>Order Items</Typography>
                      <TableContainer component={Paper} sx={{ backgroundColor: "white", boxShadow: "none", maxHeight: 'none', overflow: 'visible' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Item</strong></TableCell>
                              <TableCell><strong>Product Name</strong></TableCell>
                              {/* <TableCell><strong>SKU</strong></TableCell> */}
                              <TableCell><strong>Size</strong></TableCell>
                              <TableCell><strong>MRP</strong></TableCell>
                              <TableCell><strong>Discounted Price</strong></TableCell>
                              <TableCell><strong>Qty</strong></TableCell>
                              <TableCell><strong>Net Amount</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.orderItems.map((item, index) => (
                              <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.inventory.productName}</TableCell>
                                {/* <TableCell>{item.inventory.skuId}</TableCell> */}
                                <TableCell sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                  {item.sizeOption === 'flat' && item.selectedFlatItem}
                                  {item.sizeOption === 'fitted' && item.selectedFittedItem}
                                  {item.sizeOption === 'custom' && item.selectedCustomFittedItem}
                                  {item.sizeOption === 'custom' &&
                                    <div>Length: {item.length} Width: {item.width} Height: {item.height} {item.unit}</div>
                                  }
                                </TableCell>
                                <TableCell>₹{item.sellingPrice}</TableCell>
                                <TableCell>₹{item.discountedPrice}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>₹{item?.discountedPrice ? item?.discountedPrice : item?.sellingPrice}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '20px', marginRight: "50px" }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
                          <Typography variant="body1"><strong>Subtotal:</strong></Typography>
                          <Typography variant="body1">₹{order.orderItems.reduce((acc, item) => acc + (item.discountedPrice || item.sellingPrice) * item.quantity, 0)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '300px', marginTop: '8px' }}>
                          <Typography variant="body1"><strong>Shipping Fee:</strong></Typography>
                          <Typography variant="body1">FREE</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '300px', marginTop: '8px' }}>
                          <Typography variant="body1"><strong>Total Amount:</strong></Typography>
                          <Typography variant="body1">₹{order?.Total}</Typography>
                        </Box>
                      </Box>
                      <Divider style={{ margin: '10px 0' }} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>Sold By</Typography>
                      <Grid container spacing={2} ml={0.6} mt={0.1}>
                        <Grid xs={6}>
                          <Typography variant="body2">Ayru Jaipur</Typography>
                          <Typography variant="body2" >www.ayrujaipur.in</Typography>
                        </Grid>
                        <Grid xs={6}>
                          <Typography variant="body2">Prangan, 302012 Jaipur, Rajasthan, INDIA</Typography>
                          <Typography variant="body2">Contact Number: +91-97858 52222</Typography>
                          {/* <Typography variant="body2">Email: ayrujaipur@gmail.com</Typography>
                          <Typography variant="body2">Instagram: handblock_ayrujaipur</Typography>
                          <Typography variant="body2">
                            Operating Hours: +91-9785852222 between 11:00 AM and 5:00 PM, Monday to Saturday.
                          </Typography> */}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </>
            ) : (
              <Typography>No order details available.</Typography>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div >
  );
};

export default OrderAccordion;
