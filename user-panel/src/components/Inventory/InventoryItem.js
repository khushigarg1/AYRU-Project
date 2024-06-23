import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Grid } from '@mui/material';
import { FavoriteBorderOutlined, AddShoppingCartOutlined } from '@mui/icons-material';
import api from '../../../api';
const InventoryItem = ({ item }) => {
  const handleAddToWishlist = () => {
    // Handle wishlist functionality
    console.log(`Added ${item.productName} to wishlist`);
  };

  const handleAddToCart = () => {
    // Handle add to cart functionality
    console.log(`Added ${item.productName} to cart`);
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardMedia
        component="img"
        image={`${api.defaults.baseURL}image/${item.Media[0].url}`}
        height="200"
        alt={item.productName}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {item.productName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Price: ${item.sellingPrice}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </CardContent>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
        <Grid item>
          <IconButton aria-label="Add to Wishlist" onClick={handleAddToWishlist}>
            <FavoriteBorderOutlined />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton aria-label="Add to Cart" onClick={handleAddToCart}>
            <AddShoppingCartOutlined />
          </IconButton>
        </Grid>
      </Grid>
    </Card>
  );
};

export default InventoryItem;
