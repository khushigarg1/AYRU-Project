import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Box, Chip, useTheme } from '@mui/material';
import { FavoriteBorderOutlined, FavoriteOutlined } from '@mui/icons-material';
import Cookies from 'js-cookie';
import api from '../../../api';
import { useAuth } from '../../contexts/auth';
import { useRouter } from 'next/navigation';

const InventoryItem = ({ item, wishlistItems, setWishlistItems }) => {
  const theme = useTheme();
  const { openAuthModal, user, setWishlistCount } = useAuth();
  const token = Cookies.get('token');
  const router = useRouter();

  const handleToggleWishlist = async (event) => {
    event.stopPropagation();
    try {
      if (!token) {
        openAuthModal();
        return;
      }

      if (wishlistItems[item?.id]) {
        await api.delete(`/wishlist/${wishlistItems[item?.id]}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWishlistItems(prevItems => {
          const newItems = { ...prevItems };
          delete newItems[item?.id];
          return newItems;
        });
        setWishlistCount(prevCount => prevCount - 1);
      } else {
        const response = await api.post('/wishlist', { inventoryId: item?.id, userId: user?.id }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWishlistItems(prevItems => ({
          ...prevItems,
          [item?.id]: response.data.data.id
        }));
        setWishlistCount(prevCount => prevCount + 1);
      }
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
    }
  };

  const calculateDiscountPercentage = () => {
    if (item?.discountedPrice) {
      return ((item?.sellingPrice - item?.discountedPrice) / item?.sellingPrice * 100).toFixed(0);
    }
    return null;
  };

  return (
    <Card sx={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', cursor: "pointer" }}
      onClick={() => router.push(`/shop/${item?.id}`)}
    >
      <Box sx={{ position: 'relative' }}>
        {item?.discountedPrice && (
          <Chip
            label={
              <div style={{ textAlign: 'center' }}>
                <Typography variant="caption" component="span" sx={{ lineHeight: 1, fontWeight: "bolder" }}>
                  {`${calculateDiscountPercentage()}%`}
                </Typography>
                <Typography variant="caption" component="div" sx={{ lineHeight: 1, fontWeight: "bolder" }}>
                  off
                </Typography>
              </div>
            }
            color="secondary"
            size="small"
            sx={{
              position: 'absolute',
              top: 4,
              left: 4,
              zIndex: 1,
              padding: '8px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '40px',
              width: '40px',
              borderRadius: '50%',
              fontSize: '2px',
              fontWeight: 'bold',
            }}
          />
        )}
        {item?.extraOptionOutOfStock && (
          <Chip
            label={
              <div style={{ textAlign: 'center' }}>
                <Typography variant="caption" component="span" sx={{
                  lineHeight: 1,
                  fontWeight: "bolder",
                  color: "white",
                }}>
                  Sold out
                </Typography>
              </div>
            }
            color="secondary"
            size="small"
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              zIndex: 1,
              padding: '7px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '12px',
              fontSize: '2px',
              fontWeight: 'bold',
              backgroundColor: "#cf2e2e"
            }}
          />
        )}
        <CardMedia
          component="img"
          image={`https://ayrujaipur.s3.amazonaws.com/${item?.Media[0]?.url}`}
          height="200"
          alt={item?.productName}
        />
        <IconButton
          aria-label="Add to Wishlist"
          onClick={handleToggleWishlist}
          sx={{ position: 'absolute', bottom: 4, right: 4, zIndex: 1, backgroundColor: 'white', '&:hover': { backgroundColor: 'lightgray' } }}
        >
          {wishlistItems[item?.id] ? <FavoriteOutlined style={{ color: 'red' }} /> : <FavoriteBorderOutlined />}
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1, padding: "10px", '&:last-child': { paddingBottom: "10px" } }}>
        <Typography variant="body1" gutterBottom sx={{ lineHeight: "1", fontWeight: "bolder" }}>
          {item?.productName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Category: </strong>{item?.Category?.categoryName}
        </Typography>
        {item?.discountedPrice ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
              Rs.{item?.sellingPrice}
            </Typography>
            <Typography variant="body1" color={theme?.palette?.text?.contrastText} sx={{ fontSize: "14px" }}>
              Rs.{item?.discountedPrice}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ fontSize: "14px", fontWeight: "bold" }}>
            Rs.{item?.sellingPrice}
          </Typography>
        )}
        <Typography variant='body2' sx={{ color: item?.extraOptionOutOfStock ? '#cf2e2e' : 'green' }}>
          {item?.extraOptionOutOfStock === true ? "Out of Stock" : "In Stock"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InventoryItem;
