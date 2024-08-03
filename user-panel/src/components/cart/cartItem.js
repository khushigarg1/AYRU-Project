"use client";
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardActionArea, CardContent, CardMedia, Button, useTheme, IconButton, useMediaQuery, Snackbar, Divider, Chip, SnackbarContent, Modal, Tooltip, TextField } from '@mui/material';
import api from '../../../api';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AddSharp, Close, DeleteForever, Edit, RemoveSharp } from '@mui/icons-material';

export const CartItem = ({ item, fetchCartStatus }) => {
  const { openAuthModal, user, setCartCount, setWishlistCount } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();
  const token = Cookies.get('token');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [displayQuantity, setDisplayQuantity] = useState(item?.quantity);
  const [displayMinQuantity, setDisplayMinQuantity] = useState(item?.cartSizeItem?.minQuantity);
  const [displayMaxQuantity, setDisplayMaxQuantity] = useState(item?.cartSizeItem?.maxQuantity);

  const updateQuantity = async (newQuantity) => {
    try {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      await api.put(`/cart/${item?.id}`, { quantity: newQuantity });
      await fetchCartStatus();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDecrement = () => {
    if (displayQuantity > (displayMinQuantity || 1)) {
      const newQuantity = displayQuantity - 1;
      setDisplayQuantity(newQuantity);
      updateQuantity(newQuantity);
    }
  };

  const handleIncrement = () => {
    if (displayQuantity < (displayMaxQuantity || Infinity)) {
      const newQuantity = displayQuantity + 1;
      setDisplayQuantity(newQuantity);
      updateQuantity(newQuantity);
    }
  };

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
  };
  const handleRemoveFromCart = async () => {
    if (itemToDelete) {
      try {
        await api.delete(`/cart/${itemToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
        fetchCartStatus();
        handleCloseModal();
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    }
    handleCloseModal();
  };

  const handleClick = (item) => {
    let customId = item.customId;
    let flatId = item.flatId;
    let fittedId = item.fittedId;

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

    const params = new URLSearchParams();
    Object.entries(details).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });

    router.push(`/shop/${item?.Inventory?.id}?${params.toString()}`);
  };
  let quantity = 5
  return (
    <>
      <Grid item key={item.id} xs={12} sm={12} md={12} lg={12} sx={{
        height: "auto", marginBottom: "5px",
        position: 'relative',
      }}>
        <Card sx={{
          position: 'relative',
          display: 'flex', flexDirection: 'row', height: '100%', cursor: "pointer",
          backgroundColor: "white",
          maxHeight: "100%",
          padding: "15px 5px",
          boxShadow: "none",
          border: item?.quantity > (item?.cartSizeItem?.quantity) || item?.quantity < (item?.cartSizeItem?.minQuantity) ? '1px solid red' : 'none',
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
              image={`https://ayrujaipur.s3.amazonaws.com/${item?.Inventory?.Media[0]?.url}`}
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
                  {`Fitted Size L×W×H =  ${item?.length}×${item?.width}×${item?.height} ${item?.unit}`}
                </Typography>
              </>
            )
            }
            {/* <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: "10px" }}>
                        <strong>Category: </strong>{item?.Inventory?.Category?.categoryName}
                      </Typography> */}

            {/* <Typography variant="body2" gutterBottom sx={{ lineHeight: "1", fontSize: "0.55em" }}>
                        <strong>SKU: </strong>{item?.Inventory?.skuId}
                      </Typography> */}
            {item?.cartSizeItem?.discountedPrice ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ textDecoration: 'line-through', fontSize: "0.7em" }}>
                  Rs.{item?.cartSizeItem?.sellingPrice}
                </Typography>
                <Typography variant="body2" color={theme?.palette?.text?.contrastText} sx={{ fontSize: "0.7em" }}>
                  Rs.{item?.cartSizeItem?.discountedPrice}
                </Typography>
                <Typography variant="body2" color="error" sx={{
                  background: 'inherit',
                  color: "black", fontSize: "0.7em"
                }}>
                  {`(${Math.round(((item?.cartSizeItem?.sellingPrice - item?.cartSizeItem?.discountedPrice) / item?.cartSizeItem?.sellingPrice) * 100)}% OFF)`}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ fontSize: "0.7em" }}>
                Rs.{item?.cartSizeItem?.sellingPrice}
              </Typography>
            )}
            <Typography variant='body2' sx={{ color: item?.Inventory?.extraOptionOutOfStock ? 'red' : 'green', fontSize: "0.6em", marginBottom: "15px" }}>
              {item?.Inventory?.extraOptionOutOfStock === true || item?.quantity === 0 ? "Out of Stock" : "In Stock"}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '4px',
                padding: '0px',
                gap: 1,
                width: '150px',
              }}
              mt={2}
            >
              <Tooltip title={displayQuantity <= (displayMinQuantity || 1) ? 'Minimum quantity reached' : ''}>
                <span>
                  <IconButton
                    onClick={handleDecrement}
                    disabled={displayQuantity <= (displayMinQuantity || 1)}
                    size='small'
                    sx={{ padding: '4px' }}
                  >
                    <RemoveSharp fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <TextField
                variant='standard'
                value={displayQuantity}
                // onChange={handleChange}
                // disabled
                inputProps={{
                  min: displayMinQuantity || 1,
                  max: displayMaxQuantity || Infinity,
                  type: 'text',
                  style: { textAlign: 'center', fontSize: '14px' },
                }}
                InputProps={{
                  disableUnderline: true,
                }}
                size='small'
                sx={{
                  flexGrow: 1,
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Tooltip title={displayQuantity >= (displayMaxQuantity || Infinity) ? 'Maximum quantity reached' : ''}>
                <span>
                  <IconButton
                    onClick={handleIncrement}
                    disabled={displayQuantity >= (displayMaxQuantity || Infinity)}
                    size='small'
                    sx={{ padding: '4px' }}
                  >
                    <AddSharp fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </CardContent>

          <Grid container justifyContent="space-between" alignItems="flex-start" style={{ position: "absolute", bottom: "3px", width: "100%", overflow: "hidden", paddingLeft: "120px", paddingRight: "15px" }}
          >
            <Grid item>
              <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "10px" }}>
                {`QTY: ${item?.quantity || 0} × ₹${item?.cartSizeItem?.discountedPrice ? item?.cartSizeItem?.discountedPrice : item?.cartSizeItem?.sellingPrice} =`}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='body2' style={{ fontWeight: "bolder", color: "gray", fontSize: "10px" }}>
                {`Rs. ${(item?.quantity * (item?.cartSizeItem?.discountedPrice || item?.cartSizeItem?.sellingPrice)).toFixed(2)}`}
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
    </>
  )
}