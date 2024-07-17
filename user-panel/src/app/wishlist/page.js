"use client"
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardActionArea, CardContent, CardMedia, Button, useTheme, IconButton } from '@mui/material';
import Link from 'next/link'; // Import Link from next/link for Next.js routing
import api from '../../../api';
import { useAuth } from '@/contexts/auth';
import { DeleteForever, FavoriteBorderOutlined, FavoriteOutlined } from '@mui/icons-material';

const WishlistPage = () => {
  const { openAuthModal, user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const theme = useTheme();
  const [wishlsitId, setWishlistIds] = useState([]);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        if (user?.id) {
          const response = await api.get(`/wishlist/user/${user.id}`);
          setWishlistItems(response.data.data);
          const wishlistItemsData = response.data.data;
          const wishlistMap = wishlistItemsData.reduce((acc, wishlistItem) => {
            acc[wishlistItem.inventoryId] = wishlistItem.id;
            return acc;
          }, {});
          setWishlistIds(wishlistMap);
        } else {
          setWishlistItems([]);
        }
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
      }
    };

    fetchWishlistItems();
  }, [user?.id]);

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      // Example: Remove item from wishlist API call
      await api.delete(`/wishlist/${itemId}`);
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  // Calculate pagination range
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlistItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Wishlist
      </Typography>
      {wishlistItems.length === 0 && (
        <Typography variant="body1">
          Your wishlist is empty. <Link href="/">Browse products</Link> to add items.
        </Typography>
      )}
      <Grid container spacing={1}>
        {currentItems.map((item) => (
          <Grid item key={item.id} xs={6} sm={6} md={4} lg={3}>
            <Card sx={{
              position: 'relative',
              display: 'flex', flexDirection: 'column', height: '100%', cursor: "pointer"
            }}
              onClick={() => router.push(`/shop/${item?.id}`)}
            >
              <CardActionArea component={Link} href={`/shop/${item.Inventory.id}`}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={`https://ayru-jaipur.s3.amazonaws.com/${item?.Inventory?.Media[0]?.url}`}
                    alt={item.Inventory.productName}

                    sx={{
                      objectFit: 'contain',
                      height: "210px",
                      maxHeight: "100%",
                      borderRadius: "0px"
                    }}
                  />

                  <IconButton
                    aria-label="Add to Wishlist"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    sx={{ position: 'absolute', bottom: 4, right: 4, zIndex: 1, backgroundColor: 'white', '&:hover': { backgroundColor: 'lightgray' } }}
                  >
                    {wishlsitId[item?.Inventory?.id] ? <FavoriteOutlined style={{ color: 'red' }} /> : <FavoriteBorderOutlined />}
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1, padding: "10px", '&:last-child': { paddingBottom: "10px" } }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ lineHeight: "1", fontWeight: "bolder" }}>
                    {item?.Inventory?.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Category: </strong>{item?.Inventory?.category?.categoryName}
                  </Typography>
                  {item?.Inventory?.discountedPrice ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                        Rs.{item?.Inventory?.sellingPrice}
                      </Typography>
                      <Typography variant="body2" color={theme?.palette?.text?.contrastText}>
                        Rs.{item?.Inventory?.discountedPrice}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2">
                      Rs.{item?.Inventory?.sellingPrice}
                    </Typography>
                  )}
                  <Typography variant='body2' sx={{ color: item?.Inventory?.extraOptionOutOfStock ? 'red' : 'green' }}>
                    {item?.Inventory?.extraOptionOutOfStock === true ? "Out of Stock" : "In Stock"}
                  </Typography>
                  {/* <Button variant="primary" color="error" onClick={() => handleRemoveFromWishlist(item.id)}>
                    <DeleteForever />
                  </Button> */}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Pagination controls */}
      <Box mt={3} display="flex" justifyContent="center">
        {Array.from({ length: Math.ceil(wishlistItems.length / itemsPerPage) }, (_, index) => (
          <Button key={index} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </Button>
        ))}
      </Box>
    </Box >
  );
};

export default WishlistPage;
