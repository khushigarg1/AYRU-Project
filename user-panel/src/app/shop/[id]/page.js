"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, CardMedia, Chip, Container, Grid, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FavoriteBorderOutlined, FavoriteOutlined, Share } from '@mui/icons-material';
import Slider from 'react-slick';
import Cookies from 'js-cookie';
import api from '../../../../api';
import { useAuth } from '@/contexts/auth';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ProductSlider from '@/components/Inventory/productSlider';

const ProductDetails = ({ params }) => {
  const { id } = params;
  const theme = useTheme();
  const { openAuthModal, user, wishlistCount, setWishlistCount } = useAuth();
  const [product, setProduct] = useState(null);
  const [wishlistItems, setWishlistItems] = useState({});
  const token = Cookies.get('token');
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/inventory/${id}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

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

    fetchProduct();
  }, [id, token, user, setWishlistCount]);

  const handleToggleWishlist = async () => {
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
        console.log(`Removed ${product.productName} from wishlist`);
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
        console.log(`Added ${product.productName} to wishlist`);
      }
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
    }
  };

  if (!product) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Box my={1}>
        <Grid container direction={isMobile ? "column" : "row"} spacing={2}>
          <Grid item xs={12} sm={6}>
            <ProductSlider media={product.Media} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {product?.productName}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {product?.category?.categoryName}
              </Typography>
              {product.discountedPrice ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ textDecoration: 'line-through' }}>
                    ₹{product?.costPrice?.toFixed(2)}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    ₹{product?.discountedPrice?.toFixed(2)}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body1">
                  ₹{product?.costPrice?.toFixed(2)}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {product?.description}
              </Typography>
              <IconButton
                aria-label="Add to Wishlist"
                onClick={handleToggleWishlist}
                sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: 'lightgray' }, marginTop: 2 }}
              >
                {wishlistItems[product?.id] ? <FavoriteOutlined style={{ color: 'red' }} /> : <FavoriteBorderOutlined />}
              </IconButton>
              <IconButton
                aria-label="Share"
                sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: 'lightgray' }, marginTop: 2, marginLeft: 2 }}
              >
                <Share />
              </IconButton>
            </CardContent>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetails;
