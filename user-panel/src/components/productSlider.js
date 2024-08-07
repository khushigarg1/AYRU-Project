"use client";
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Box, Card, CardContent, CardMedia, Typography, IconButton, useMediaQuery, useTheme, Divider } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FavoriteBorderOutlined, FavoriteOutlined, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import api from '../../api';
import "./slider.css";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuth } from '@/contexts/auth';

// Custom Arrow Components
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      style={{ position: 'absolute', top: '50%', right: '5px', zIndex: 2, backgroundColor: 'transparent', transform: 'translateY(-30%)' }}
    >
      <ArrowForwardIos />
    </IconButton>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      style={{ position: 'absolute', top: '50%', left: '5px', zIndex: 2, backgroundColor: 'transparent', transform: 'translateY(-30%)' }}
    >
      <ArrowBackIos />
    </IconButton>
  );
};

export const ProductSlider = ({ products }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const itemsPerPage = isMobile ? 2 : 5;
  const router = useRouter();
  const slicedProducts = products.slice(0, 10);
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: itemsPerPage,
    slidesToScroll: itemsPerPage,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
    appendDots: dots => (
      <Box component="ul" sx={{ margin: 0, padding: 0, display: 'flex', justifyContent: 'center', listStyle: 'none', bottom: "10px" }}>
        {dots}
      </Box>
    ),
    customPaging: i => (
      <Box
        component="div"
        sx={{
          width: '10px',
          height: '10px',
          backgroundColor: '#000',
          borderRadius: '50%',
          display: 'inline-block',
          margin: '0 5px',
        }}
        className="slick-dot"
      ></Box>
    ),
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: theme.palette.text.fontFamily, mt: 2 }}>
      <Box style={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: "2%" }}>
        <Typography variant={isMobile ? 'h4' : 'h3'} sx={{ mb: 2, color: theme.palette.text.text }}>
          New Arrivals
        </Typography>
      </Box>
      <Box sx={{ width: '100%', margin: 'auto', position: 'relative', paddingBottom: '40px' }}>
        <Slider {...settings}>
          {slicedProducts.map((product, index) => (
            <Box key={product.id} p={1} sx={{ backgroundColor: "transparent", position: 'relative' }}>
              <Card sx={{ backgroundColor: "transparent", boxShadow: "none", position: 'relative', cursor: "pointer" }}
                onClick={() => router.push(`/shop/${product?.id}`)}
              >
                <IconButton
                  sx={{ position: 'absolute', top: 5, right: 10, zIndex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
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
                    objectFit: 'contain',
                    height: isMobile ? "200px" : "350px",
                  }}
                />
                <CardContent sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "left" }}>
                  <Typography gutterBottom variant="body1" component="div" sx={{ fontSize: "14px", lineHeight: "1.1" }}>
                    {product.productName}
                  </Typography>
                  {product.discountedPrice ? (
                    <Box sx={{ display: 'flex', alignItems: 'left', gap: 0.5 }}>
                      <Typography variant="body2">
                        MRP
                      </Typography>
                      <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                        ₹{product.sellingPrice?.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" sx={{ marginRight: "3px", fontWeight: "bold" }} >
                        ₹{product.discountedPrice?.toFixed(2)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ marginRight: "3px", fontWeight: "bold" }} >
                      ₹{product.sellingPrice?.toFixed(2)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
              {index < slicedProducts.length - 1 && <Divider orientation="vertical" sx={{ position: 'absolute', right: 0, top: 0, bottom: 0 }} />}
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};
