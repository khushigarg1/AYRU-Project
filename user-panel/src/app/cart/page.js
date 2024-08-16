"use client"
import React, { Suspense, useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardActionArea, CardContent, CardMedia, Button, useTheme, IconButton, useMediaQuery, Snackbar, Divider, Chip, SnackbarContent, Modal, CircularProgress } from '@mui/material';
import Link from 'next/link';
import api from '../../../api';
import { useAuth } from '@/contexts/auth';
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Close, DeleteForever, Edit } from '@mui/icons-material';
import Image from 'next/image';
import Quality from "../../../public/images/original.png"
import AssuredDelivery from "../../../public/images/assuredDelivery.png"
import SecuredPayment from "../../../public/images/securedPayment.png"
import VerifiedSeller from "../../../public/images/verifiedSeller.png"
import { WhatsappIcon } from 'next-share';
import ConfirmModal from '@/components/cart/modal';
import { CartItem } from '@/components/cart/cartItem';

const CartPage = () => {
  const { openAuthModal, user, setCartCount, setWishlistCount } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [Totalcount, setTotalCount] = useState(0);
  const [wishlsitId, setWishlistIds] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const router = useRouter();
  const token = Cookies.get('token');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  const handleCloseModal = () => {
    setItemToDelete(null);
    setModalOpen(false);
  };

  const fetchcartStatus = async () => {
    console.log("dcalll");

    try {
      if (token) {

        const response = await api.get(`/cart/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCartItems(response?.data?.data?.userCart);
        setTotalCount(response?.data?.data?.totalPrice);
        const cartItemsData = response.data.data?.userCart;
        setCartCount(cartItemsData.length);
        const cartMap = cartItemsData.reduce((acc, cartItem) => {
          acc[cartItem.inventoryId] = cartItem.id;
          return acc;
        }, {});
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };
  const fetchcart = async () => {

    setLoading(true);
    try {
      if (token) {

        const response = await api.get(`/cart/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCartItems(response?.data?.data?.userCart);
        setTotalCount(response?.data?.data?.totalPrice);
        const cartItemsData = response.data.data?.userCart;
        setCartCount(cartItemsData.length);
        const cartMap = cartItemsData.reduce((acc, cartItem) => {
          acc[cartItem.inventoryId] = cartItem.id;
          return acc;
        }, {});
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchcart();
  }, [user?.id, setCartCount]);

  const handleCheckout = () => {
    const outOfStockItems = cartItems.filter(item => item?.Inventory?.extraOptionOutOfStock);
    const quantityIssues = cartItems.some(item => {
      const cartSizeItem = item?.cartSizeItem;
      return (
        item?.quantity > (cartSizeItem?.quantity) ||
        item?.quantity < (cartSizeItem?.minQuantity)
      );
    });

    let message = '';
    if (outOfStockItems.length > 0 && quantityIssues) {
      message = "Some items in your cart are out of stock and have quantity issues; Please adjust";
    } else if (outOfStockItems.length > 0) {
      message = "Some items in your cart are out of stock.";
    } else if (quantityIssues) {
      message = "Desired quantity for an item in your cart is unavailable; please adjust.";
    }

    if (message) {
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    } else {
      router.push('/checkout');
    }
  };


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleLogin = () => {
    openAuthModal();
    return;
  }
  const whatsappMessage = cartItems?.map((item, index) => {
    let itemDetails = `${index + 1} Product: ${item?.Inventory?.productName}\n` +
      `   ProductUrl: ${process.env.REACT_APP_BASE_URL}/shop/${item?.Inventory?.id}\n` +
      `   Quantity: ${item.quantity}\n` +
      `   Selling Price: ₹${item?.cartSizeItem?.sellingPrice}\n`;

    if (item?.cartSizeItem?.discountedPrice > 0) {
      itemDetails += `   Discounted Price: ₹${item?.cartSizeItem?.discountedPrice}\n`;
    }

    if (item.sizeOption === 'flat') {
      itemDetails += `   Size: ${item.selectedFlatItem}\n`;
    } else if (item.sizeOption === 'fitted') {
      itemDetails += `   Fitted Item: ${item.selectedFittedItem}\n`;
    } else if (item.sizeOption === 'custom') {
      itemDetails += `   Custom Item: ${item.selectedCustomFittedItem}\n` +
        `   Dimensions(L*W*H): ${item.length} x ${item.width} x ${item.height} ${item.unit}\n`;
    }

    return itemDetails;
  }).join('\n');
  const userDetails = `
My Details are here:
Name: ${cartItems[0]?.User.firstName || ' '} ${cartItems[0]?.User.lastName || ' '}
Address: ${[cartItems[0]?.User.address1, cartItems[0]?.User.address2, cartItems[0]?.User.city, cartItems[0]?.User.state].filter(Boolean).join(', ') || '[Postal address, City, State]'}
Country: ${cartItems[0]?.User.country || ' '}
Zipcode: ${cartItems[0]?.User.pincode || ' '}
Mobile number: ${cartItems[0]?.User.phoneNumber || ' '}
Gmail: ${cartItems[0]?.User.email || ' '}
`;

  const whatsappURL = `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I'd like to place an international order for the following items:\n\n${whatsappMessage}${userDetails}\n\nCould you please provide details on the process, shipping costs, and delivery times?`
  )}`;


  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box p={1} style={{
      paddingLeft: isMobile ? "1%" : "8%", paddingRight: isMobile ? "1%" : "8%", backgroundColor: "#F0F0F0",
      '&:focus': {
        outline: 'none',
        boxShadow: 'none',
      },
      '&:active': {
        backgroundColor: 'inherit',
      },
      paddingBottom: "10px",
      minHeight: "70vh"
    }}>
      {/* <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant='h4' gutterBottom style={{ fontWeight: "bold" }} pt={2}>
          Shopping Cart
        </Typography>
      </Box> */}
      {cartItems && cartItems.length === 0 && (
        // <Typography variant="body2" sx={{ height: "100%", fontSize: "20px", padding: "20px" }}>
        //   Your cart is empty <strong><Link href="/shop">Browse products</Link></strong> to add items or  <strong style={{ cursor: "pointer" }} onClick={handleLogin}>Login</strong> to see your saved cart.
        // </Typography>

        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={3} mt={20} mb={20} textAlign="center">
          <Typography variant='h4' gutterBottom style={{ fontWeight: "bold" }}>
            Your Shopping Cart is Empty
          </Typography>
          <Typography variant='body1' align="center" gutterBottom>
            It looks like you haven't added any items to your cart yet. Browse our products to find items you love and add them to your cart.
          </Typography>
          <Box my={2}>
            <Button variant="contained" color="primary" component={Link} href="/shop">
              Browse Products
            </Button>
          </Box>
          <Typography variant='body1' align="center" gutterBottom>
            If you have items in your cart from a previous session, please <strong style={{ cursor: "pointer", color: "#0070f3" }} onClick={handleLogin}>Login</strong> to view them.
          </Typography>
        </Box>
      )}
      {cartItems.length !== 0 &&
        <>

          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant='h4' gutterBottom style={{ fontWeight: "bold" }} pt={2}>
              Shopping Cart
            </Typography>
          </Box>
          <Box>
            <Typography variant='body1' gutterBottom style={{ fontWeight: "bold", alignItems: "center", justifyContent: "center", paddingLeft: "1em" }}>
              Total Items : {cartItems?.length}
            </Typography>
            <Divider />
          </Box>
          <Grid container spacing={1} pl={1} mt={1} pr={1} sx={{
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
            '&:active': {
              backgroundColor: 'inherit',
            }
          }}>
            {cartItems?.map((item) => (
              <>
                <CartItem key={item.id} item={item} fetchCartStatus={fetchcartStatus} />
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
                  {`₹${Totalcount}`}
                  <Typography variant="body2" sx={{ fontSize: '0.55rem', color: 'text.secondary', mb: 1 }}>
                    (Price inclusive of all taxes)
                  </Typography>
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="column" spacing={2} style={{ padding: "0px 5px" }}>
              <Grid item>
                <Typography variant='body2' style={{ color: "black", fontSize: "14px" }}>
                  Enjoy our standard SHIPPING FREE for all orders within India
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='body2' style={{ color: "black", fontSize: "14px", lineHeight: 1 }}>
                  To ship all these items internationally, simply click on{' '}
                  <Button
                    aria-label="Chat on WhatsApp"
                    href={whatsappURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<WhatsappIcon style={{ height: "15px", width: "15px", padding: "0px", marginRight: "4px" }} />}
                    sx={{
                      color: '#25D366',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      mb: 0,
                      padding: "0px",
                      // marginLeft: "4px"
                    }}
                  >
                    WhatsApp
                  </Button>
                </Typography>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              fullWidth
              style={{
                marginTop: "16px",
                padding: "8px 16px",
                fontSize: "1rem",
                fontWeight: "bold",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderRadius: "8px"
              }}
              onClick={handleCheckout}
            >
              CHECKOUT
            </Button>
          </Box >
          <Box
            style={{
              marginTop: "2%",
              backgroundColor: theme.palette.background.paper,
              padding: "2%",
              // borderRadius: "8px", // Add border radius for rounded corners
              // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              bottom: "0",
              width: "100%",
              position: !isMobile && "relative",
            }}
            pb={2}
          >
            <Grid container style={{ marginTop: "10px" }} spacing={0}>
              <Grid item xs={3} sm={3} md={3} lg={3} container alignItems="center" justifyContent="center">
                <Image src={Quality} alt={"100% Original products"} width={50} height={50} style={{ color: "black", marginTop: "-4px" }} />
                <Typography variant="body2" sx={{ marginLeft: "8px", fontSize: "10px", marginTop: "0px" }}>
                  Genuine products
                </Typography>
              </Grid>
              <Grid item xs={3} sm={3} md={3} lg={3} container alignItems="center" justifyContent="center">
                <Image src={VerifiedSeller} alt={"Verified Customer"} width={40} height={40} />
                <Typography variant="body2" sx={{ marginLeft: "8px", fontSize: "10px", marginTop: "10px" }}>
                  Verified Seller
                </Typography>
              </Grid>
              <Grid item xs={3} sm={3} md={3} lg={3} container alignItems="center" justifyContent="center">
                <Image src={AssuredDelivery} alt={"Assured Delivery"} width={40} height={40} />
                <Typography variant="body2" sx={{ marginLeft: "8px", fontSize: "10px", marginTop: "10px" }}>
                  Assured Delivery
                </Typography>
              </Grid>
              <Grid item xs={3} sm={3} md={3} lg={3} container alignItems="center" justifyContent="center">
                <Image src={SecuredPayment} alt={"Secured Payment"} width={40} height={40} />
                <Typography variant="body2" sx={{ marginLeft: "8px", fontSize: "10px", marginTop: "10px" }}>
                  Secured Payment
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </>
      }
      {snackbarOpen &&
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        >
          <SnackbarContent style={{
            backgroundColor: "#fa6666",
            color: "black"
          }}
            message={snackbarMessage}
          />
        </Snackbar>
      }
      <Box mt={3}>

      </Box >
    </Box >
  );
};


const CartsuspensePage = () => {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <CartPage />
    </Suspense>
  );
};

export default CartsuspensePage;
