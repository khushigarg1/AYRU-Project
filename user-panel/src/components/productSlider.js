import React from 'react';
import Slider from 'react-slick';
import { Box, Card, CardContent, CardMedia, Typography, IconButton, useMediaQuery, useTheme, Button, Divider } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import api from '../../api';
import "./slider.css";

export const ProductSlider = ({ products }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const itemsPerPage = isMobile ? 2 : 5;

  // Slice the products array to show only the first 10 products
  const slicedProducts = products.slice(0, 10);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: itemsPerPage,
    slidesToScroll: itemsPerPage,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
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
      <Box component="ul" sx={{ margin: 0, padding: 0, display: 'flex', justifyContent: 'center', listStyle: 'none' }}>
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
        className="slick-dot" // Ensure this class is added
      ></Box>
    ),
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: theme.palette.text.fontFamily, mt: 2 }}>
      <Box style={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottm: "2%" }}>
        <Typography variant={isMobile ? 'h4' : 'h3'} sx={{ mb: 2, color: theme.palette.text.text }}>
          New Arrivals
        </Typography>
      </Box>
      <Box sx={{ width: '100%', margin: 'auto', position: 'relative', paddingBottom: '40px' }}>
        <Slider {...settings}>
          {slicedProducts.map((product, index) => (
            <Box key={product.id} p={1} sx={{ backgroundColor: "transparent", position: 'relative' }}>
              <Card sx={{ backgroundColor: "transparent", boxShadow: "none", position: 'relative' }}>
                <IconButton
                  sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                  onClick={() => console.log('Add to wishlist', product.id)}
                >
                  <FavoriteBorderIcon />
                </IconButton>
                <CardMedia
                  component="img"
                  height={isMobile ? 200 : 400}
                  image={product.Media && product.Media.length > 0 ? `${api.defaults.baseURL}image/${product.Media[0].url}` : '/fallback_image_url'}
                  alt={product.productName}
                />
                <CardContent sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                  <Typography gutterBottom variant="body1" component="div">
                    {product.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${product.sellingPrice?.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={() => console.log('Add to cart', product.id)}
                  >
                    Add to Cart
                  </Button>
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
