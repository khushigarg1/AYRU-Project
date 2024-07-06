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
import ItemDetails from '@/components/Inventory/ItemDetails';

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

    fetchProduct();
  }, []);

  if (!product) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container sx={{
      marginTop: isMobile ? 1 : 3, backgroundColor: theme.palette.background.paper
    }}>
      <Box my={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ProductSlider itemlist={product} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ItemDetails product={product} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetails;
