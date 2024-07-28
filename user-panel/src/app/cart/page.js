"use client"
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardActionArea, CardContent, CardMedia, Button, useTheme, IconButton, useMediaQuery, Snackbar, Divider, Chip, SnackbarContent, Modal } from '@mui/material';
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

  const handleOpenModal = (item) => {
    setItemToDelete(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setItemToDelete(null);
    setModalOpen(false);
  };

  const handleAddToWishlist = async () => {
    if (itemToDelete) {
      const response = await api.post('/wishlist', { inventoryId: itemToDelete?.Inventory?.id, userId: user?.id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      handleRemoveFromCart();
      if (!response?.data?.data?.addedAlready) {
        setWishlistCount(prevCount => prevCount + 1);
      }
    }
    handleCloseModal();
  }
  const fetchcartStatus = async () => {
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
  useEffect(() => {
    // if (user && user.id && token) {
    fetchcartStatus();
    // }
  }, [user?.id, setCartCount]);


  const handleRemoveFromCart = async () => {
    if (itemToDelete) {
      try {
        await api.delete(`/cart/${itemToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
        fetchcartStatus();
        handleCloseModal();
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    }

    handleCloseModal();
  };
  const handleCheckout = () => {
    const outOfStockItems = cartItems.filter(item => item?.Inventory?.extraOptionOutOfStock);
    if (outOfStockItems.length > 0) {
      setSnackbarOpen(true);
    } else {
      router.push('/checkout');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Calculate pagination range
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);
  const handleLogin = () => {
    openAuthModal();
    return;
  }
  const handleClick = (item) => {
    let customId = item.customId;
    let flatId = item.flatId;
    let fittedId = item.fittedId;

    // If customId is provided, find the corresponding flatId from customFittedInventory
    if (customId) {
      const customFittedItem = item.Inventory.customFittedInventory.find(
        (inventory) => inventory.id === item.customId
      );

      if (customFittedItem) {
        customId = customFittedItem?.InventoryFlat?.Flat?.id;
      }
    }
    if (flatId) {
      const FlatItem = item.Inventory.InventoryFlat.find(
        (inventory) => inventory.id === flatId
      );

      if (FlatItem) {
        flatId = FlatItem?.Flat?.id;
      }
    }
    if (fittedId) {
      const FittedItem = item.Inventory.InventoryFitted.find(
        (inventory) => inventory.id === fittedId
      );

      if (FittedItem) {
        fittedId = FittedItem?.Fitted?.id;
      }
    }

    const details = {
      sizeOption: item?.sizeOption,
      flatId: flatId,
      customId: customId,
      fittedId: fittedId,
      unit: item.unit,
      length: item.length,
      width: item.width,
      height: item.height
    };

    // Create a URLSearchParams object and append the details
    const params = new URLSearchParams();
    Object.entries(details).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });

    router.push(`/shop/${item?.Inventory?.id}?${params.toString()}`);
  };
  const whatsappMessage = "heyy"
  return (
    <Box p={1} mt={2} style={{ paddingLeft: isMobile ? "1%" : "8%", paddingRight: isMobile ? "1%" : "8%", backgroundColor: "#F0F0F0" }}>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant='h4' gutterBottom style={{ fontWeight: "bold" }}>
          Shopping Cart
        </Typography>
      </Box>
      {cartItems.length === 0 && (
        <Typography variant="body1">
          Your cart is empty <strong><Link href="/shop">Browse products</Link></strong> to add items or log in to see your saved cart <strong style={{ cursor: "pointer" }} onClick={handleLogin}>Login</strong>.
        </Typography>
      )}
      {cartItems.length !== 0 &&
        <>
          <Box>
            <Typography variant='body1' gutterBottom style={{ fontWeight: "bold", alignItems: "center", justifyContent: "center", paddingLeft: "1em" }}>
              Total Items : {cartItems?.length}
            </Typography>
            <Divider />
          </Box>
          <Grid container spacing={1} pl={1} mt={1} pr={1}>
            {cartItems?.map((item) => (
              <>
                <Grid item key={item.id} xs={12} sm={12} md={12} lg={12} sx={{ height: "auto", marginBottom: "5px" }}>
                  <Card sx={{
                    position: 'relative',
                    display: 'flex', flexDirection: 'row', height: '100%', cursor: "pointer",
                    backgroundColor: "white",
                    maxHeight: "100%",
                    padding: "15px 5px"
                  }}
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
                        image={`https://ayru-jaipur.s3.amazonaws.com/${item?.Inventory?.Media[0]?.url}`}
                        alt={item.Inventory.productName}
                        onClick={() => handleClick(item)}
                        // onClick={() => router.push(`/shop/${item?.Inventory?.id}`)}
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
                        {item?.Inventory?.productName}
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
                        <strong>Category: </strong>{item?.Inventory?.Category?.categoryName}
                      </Typography> */}

                      <Typography variant="body2" gutterBottom sx={{ lineHeight: "1", fontSize: "0.55em" }}>
                        <strong>SKU: </strong>{item?.Inventory?.skuId}
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
                      <Typography variant='body2' sx={{ color: item?.Inventory?.extraOptionOutOfStock ? 'red' : 'green', fontSize: "0.6em", marginBottom: "15px" }}>
                        {item?.Inventory?.extraOptionOutOfStock === true || item?.quantity === 0 ? "Out of Stock" : "In Stock"}
                      </Typography>

                      <Button
                        variant='outlined'
                        sx={{
                          position: "absolute", color: "black", fontSize: "8px",
                          padding: "2px",
                          right: "5px", bottom: "30px"
                        }}
                      >
                        <Edit fontSize='10px' /> Edit
                      </Button>
                      {/* <Grid container justifyContent="space-between" alignItems="flex-start" style={{ position: "absolute", bottom: "3px", width: "100%", overflow: "hidden", paddingRight: "150px" }}
                      >
                        <Grid item>
                          <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "10px" }}>
                            {`QTY: ${item?.quantity || 0} × ₹${item?.Inventory?.discountedPrice ? item?.Inventory?.discountedPrice : item?.Inventory?.sellingPrice} =`}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "10px" }}>
                            {`Rs. ${(item?.quantity * (item?.Inventory?.discountedPrice || item?.Inventory?.sellingPrice)).toFixed(2)}`}
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
                    <IconButton
                      aria-label="Add to Wishlist"
                      onClick={() => handleOpenModal(item)}
                      // onClick={() => handleRemoveFromCart(item.id)}
                      sx={{ position: 'absolute', top: 4, right: 4, zIndex: 1, padding: "2px", backgroundColor: "#F0F0F0" }}
                    >
                      <DeleteForever sx={{ width: "15px", height: "15px", color: "black" }} />
                    </IconButton>
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
                  {`₹${Totalcount.toFixed(2)}`}
                  <Typography variant="body2" sx={{ fontSize: '0.55rem', color: 'text.secondary', mb: 1 }}>
                    (Price inclusive of all taxes)
                  </Typography>
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="column" spacing={2} style={{ padding: "0px 5px" }}>
              <Grid item>
                <Typography variant='body2' style={{ color: "black", fontSize: "12px" }}>
                  Enjoy FREE SHIPPING for all orders within INDIA
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='body2' style={{ color: "black", fontSize: "12px", lineHeight: 1 }}>
                  To know the INTERNATIONAL SHIPPING cost, {' '}
                  <Button
                    aria-label="Chat on WhatsApp"
                    href={`https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`}
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
                  {' '}us with your city & zipcode
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
              position: !isMobile && "relative"
            }}
          >
            <Grid container style={{ marginTop: "10px" }} spacing={0}>
              <Grid item xs={3} sm={3} md={3} lg={3} container alignItems="center" justifyContent="center">
                <Image src={Quality} alt={"100% Original products"} width={50} height={50} style={{ color: "black" }} />
                <Typography variant="body2" sx={{ marginLeft: "8px", fontSize: "10px", marginTop: "10px" }}>
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
          message={"Some items in your cart are out of stock."}
        >
          <SnackbarContent style={{
            backgroundColor: theme.palette.background.primary,
            color: "black"
          }}
            message={"Some items in your cart are out of stock."}
          />
        </Snackbar>
      }
      {/* <ConfirmModal
        open={modalOpen}
        handleClose={handleCloseModal}
        handleRemove={handleRemove}
        handleAddToWishlist={handleAddToWishlistClick}
      /> */}
      {/* Pagination controls */}
      {/* <Box mt={3} display="flex" justifyContent="center">
        {Array.from({ length: Math.ceil(cartItems.length / itemsPerPage) }, (_, index) => (
          <Button key={index} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </Button>
        ))}
      </Box> */}

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          padding: "16px 32px",
          borderRadius: 2,
        }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 4, right: 4 }}>
            <Close />
          </IconButton>
          <Typography variant="h6" component="h2">
            Are you sure you want to delete this item?
          </Typography>
          <Divider />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="ghost"
              color="secondary"
              onClick={() => handleAddToWishlist()}
              sx={{ width: "55%" }}
            >
              Add to Wishlist
            </Button>
            {/* <Divider orientation="vertical" variant="middle" flexItem /> */}
            <Button
              variant="ghost"
              color="secondary"
              onClick={() => handleRemoveFromCart()}
              sx={{ width: "40%" }}
            >
              Remove
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box >
  );
};

export default CartPage;
