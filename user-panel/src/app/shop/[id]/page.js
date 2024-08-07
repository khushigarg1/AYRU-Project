"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, CardMedia, Chip, CircularProgress, Container, Grid, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FavoriteBorderOutlined, FavoriteOutlined, Share } from '@mui/icons-material';
import Slider from 'react-slick';
import Cookies from 'js-cookie';
import api from '../../../../api';
import { useAuth } from '@/contexts/auth';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ProductSlider from '@/components/Inventory/productSlider';
import ItemDetails from '@/components/Inventory/ItemDetails';
import Instructions from "../../../../public/images/instruction.png"
import Image from 'next/image';

const ProductDetails = ({ params }) => {
  const { id } = params;
  const theme = useTheme();
  const { openAuthModal, user, wishlistCount, setWishlistCount } = useAuth();
  const [product, setProduct] = useState(null);
  const [wishlistItems, setWishlistItems] = useState({});
  const token = Cookies.get('token');
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParamsObject = {};
    for (const [key, value] of params.entries()) {
      queryParamsObject[key] = value;
    }
    setQueryParams(queryParamsObject);
    console.log(queryParams, queryParamsObject);
  }, []);

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
    );
  }

  return (
    <Container sx={{
      marginTop: isMobile ? 1 : 3, backgroundColor: theme.palette.background.paper, fontFamily: theme.palette.text.font
    }}>
      {/* <Box my={1} sx={{ fontFamily: theme.palette.text.font }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ProductSlider itemlist={product} sx={{ fontFamily: theme.palette.text.font }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ItemDetails product={product} sx={{ fontFamily: theme.palette.text.font }} />
          </Grid>
        </Grid>
      </Box> */}
      <ItemDetails product={product} queryParams={queryParams} />
      <Box style={{ display: "flex", justifyContent: "center" }}>

        {isTablet &&
          <Image src={Instructions} alt="Image"
            style={{ mt: 0, width: isMobile ? "100%" : "50%", height: isMobile ? "100%" : "50%", padding: "5px" }}
          // style={{ position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)', maxWidth: '20%', height: 'auto' }}
          />
        }
      </Box>
    </Container>
  );
};

export default ProductDetails;
