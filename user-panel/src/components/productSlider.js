"use client";
import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { FavoriteBorderOutlined, FavoriteOutlined } from '@mui/icons-material';
import api from '../../api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuth } from '@/contexts/auth';
import "./slider.css";

export const ProductSlider = ({ products }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const itemsPerPage = isMobile ? 1 : 2;
  const router = useRouter();
  const slicedProducts = products.slice(0, 20);
  const { openAuthModal, user, wishlistCount, setWishlistCount } = useAuth();
  const [wishlistItems, setWishlistItems] = useState({});
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        if (token) {
          const response = await api.get(`/wishlist/user/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const wishlistItemsData = response.data.data;
          setWishlistCount(wishlistItemsData.length);
          const wishlistMap = wishlistItemsData.reduce((acc, wishlistItem) => {
            acc[wishlistItem.inventoryId] = wishlistItem.id;
            return acc;
          }, {});
          setWishlistItems(wishlistMap);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    if (user && user.id && token) {
      fetchWishlistStatus();
    }
  }, [token, user, setWishlistCount]);

  const handleToggleWishlist = async (event, product) => {
    event.stopPropagation();
    try {
      if (!token) {
        openAuthModal();
        return;
      }

      if (wishlistItems[product.id]) {
        await api.delete(`/wishlist/${wishlistItems[product.id]}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWishlistItems(prevItems => {
          const newItems = { ...prevItems };
          delete newItems[product.id];
          return newItems;
        });
        setWishlistCount(prevCount => prevCount - 1);
      } else {
        const response = await api.post('/wishlist', { inventoryId: product.id, userId: user?.id }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWishlistItems(prevItems => ({
          ...prevItems,
          [product.id]: response.data.data.id
        }));
        setWishlistCount(prevCount => prevCount + 1);
      }
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
      <Typography variant={isMobile ? 'h4' : 'h3'} sx={{ mb: 2, color: theme.palette.text.text }}>
        New Arrivals
      </Typography>

      {/* Scrollable container */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'scroll',
          gap: 2,
          padding: '10px',
          width: '100%',
          '&::-webkit-scrollbar': {
            display: 'none',
          }
          // "&::-webkit-scrollbar": {
          //   height: '4px',
          // },
          // "&::-webkit-scrollbar-thumb": {
          //   backgroundColor: theme.palette.primary.main,
          //   borderRadius: '10px',
          // },
          // "&::-webkit-scrollbar-track": {
          //   backgroundColor: theme.palette.background.default,
          //   borderRadius: '10px',
          // },
        }}
      >
        {slicedProducts.map((product) => (
          <Card
            key={product.id}
            sx={{
              // minWidth: isMobile ? '30%' : '40%',
              width: isMobile ? "42%" : isTablet ? "30%" : "20%",
              flexShrink: 0,
              backgroundColor: "transparent",
              boxShadow: "none",
              position: 'relative',
              cursor: "pointer",
            }}
            onClick={() => router.push(`/shop/${product?.id}`)}
          >
            <IconButton
              sx={{
                position: 'absolute',
                top: 2,
                right: 2,
                zIndex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }}
              onClick={(event) => handleToggleWishlist(event, product)}
            >
              {wishlistItems[product.id] ? <FavoriteOutlined style={{ color: 'red' }} /> : <FavoriteBorderOutlined />}
            </IconButton>
            <CardMedia
              component="img"
              height={isMobile ? 200 : 350}
              image={product.Media && product.Media.length > 0 ? `https://ayrujaipur.s3.amazonaws.com/${product.Media[0].url}` : '/fallback_image_url'}
              alt={product.productName}
              sx={{
                objectFit: 'fit',
                height: isMobile ? 200 : 350,
              }}
            />
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", height: "100px", maxHeight: "200px", padding: "10px 0px" }}>
              <Typography gutterBottom variant="body1" component="div" sx={{ fontSize: "14px", lineHeight: "1.1" }}>
                {product.productName}
              </Typography>
              {product.discountedPrice ? (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ textDecoration: 'line-through', fontSize: "14px" }}>
                    ₹{product.sellingPrice?.toFixed(2)}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: "14px", fontWeight: "bold" }}>
                    ₹{product.discountedPrice?.toFixed(2)}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body1" sx={{ fontSize: "14px", fontWeight: "bold" }}>
                  ₹{product.sellingPrice?.toFixed(2)}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
