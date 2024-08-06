"use client"
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardActionArea, CardContent, CardMedia, Button, useTheme, IconButton, Divider } from '@mui/material';
import Link from 'next/link'; // Import Link from next/link for Next.js routing
import api from '../../../api';
import { useAuth } from '@/contexts/auth';
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter } from 'next/navigation';
const WishlistPage = () => {
  const { openAuthModal, user, wishlistCount, setWishlistCount, handleLogin } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const theme = useTheme();
  const [wishlsitId, setWishlistIds] = useState([]);
  const router = useRouter();
  const fetchWishlistItems = async () => {
    try {
      if (user?.id) {
        const response = await api.get(`/wishlist/user/${user.id}`);
        setWishlistItems(response.data.data);
        const wishlistItemsData = response.data.data;
        setWishlistCount(wishlistItemsData.length);
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
  useEffect(() => {

    fetchWishlistItems();
  }, [user?.id, setWishlistCount]);

  const handleRemoveFromWishlist = async (itemId) => {
    event.stopPropagation();
    try {
      await api.delete(`/wishlist/${itemId}`);
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId));
      fetchWishlistItems();
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  // Calculate pagination range
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlistItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Box p={1} sx={{ backgroundColor: "#F0F0F0" }}>
      {/* <Typography variant="h4" gutterBottom>
        Wishlist
      </Typography> */}
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant='h4' gutterBottom style={{ fontWeight: "bold" }}>
          Wishlist Items
        </Typography>
      </Box>
      {wishlistItems.length === 0 && (
        <Typography variant="body1">
          Your wishlist is empty. <strong><Link href="/shop">Browse products</Link></strong> to add items or <strong style={{ cursor: "pointer" }} onClick={handleLogin}>Login</strong> to see your saved items.
        </Typography>
      )}
      {wishlistItems.length > 0 &&
        <>
          <Box sx={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", padding: "2px"
          }}>
            <Typography variant='body1' gutterBottom style={{ fontWeight: "bold", alignItems: "center", justifyContent: "center" }}>
              Total Items : {wishlistItems?.length}
            </Typography>
            <Divider />
          </Box>
          <Grid container spacing={1} >
            {currentItems.map((item) => (
              <Grid item key={item.id} xs={6} sm={6} md={4} lg={3}>
                <Card sx={{
                  position: 'relative',
                  display: 'flex', flexDirection: 'column', height: '100%', cursor: "pointer",
                  backgroundColor: "transparent"
                }}
                >
                  <CardActionArea >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={`https://ayrujaipur.s3.amazonaws.com/${item?.Inventory?.Media[0]?.url}`}
                        alt={item.Inventory.productName}
                        onClick={() => router.push(`/shop/${item?.Inventory?.id}`)}
                        sx={{
                          objectFit: 'fit',
                          height: "210px",
                          maxHeight: "100%",
                          maxWidth: "100%",
                          borderRadius: "0px"
                        }}
                      />

                      <IconButton
                        aria-label="Add to Wishlist"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        sx={{ position: 'absolute', top: 4, right: 4, zIndex: 1, padding: "2px", backgroundColor: "hsl(0deg 0% 100% / 60%)", width: "24px", height: "24px", border: "1.2px solid #d4d5d9" }}
                      >
                        <ClearIcon sx={{ width: "16px", height: "16px" }} />
                      </IconButton>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, padding: "12px 8px", '&:last-child': { paddingBottom: "10px" } }}>
                      <Typography variant="body1" gutterBottom sx={{ lineHeight: "1", fontWeight: "bolder" }}>
                        {item?.Inventory?.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: "10px" }}>
                        <strong>Category: </strong>{item?.Inventory?.Category?.categoryName}
                      </Typography>
                      {item?.Inventory?.discountedPrice ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ textDecoration: 'line-through', fontSize: "10px" }}>
                            Rs.{item?.Inventory?.sellingPrice}
                          </Typography>
                          <Typography variant="body2" color={theme?.palette?.text?.contrastText} sx={{ fontSize: "10px" }}>
                            Rs.{item?.Inventory?.discountedPrice}
                          </Typography>
                          <Typography variant="body2" color="error" sx={{
                            background: 'inherit',
                            color: "black", fontSize: "10px"
                          }}>
                            {`(${Math.round(((item?.Inventory?.sellingPrice - item?.Inventory?.discountedPrice) / item?.Inventory?.sellingPrice) * 100)}% OFF)`}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ fontSize: "10px" }}>
                          Rs.{item?.Inventory?.sellingPrice}
                        </Typography>
                      )}
                      <Typography variant='body1' sx={{ color: item?.Inventory?.extraOptionOutOfStock ? 'red' : 'green', fontSize: "10px" }}>
                        {item?.Inventory?.extraOptionOutOfStock === true ? "Out of Stock" : "In Stock"}
                      </Typography>
                    </CardContent>
                    {/* <Button variant="primary" color="error" onClick={() => handleRemoveFromWishlist(item.id)} sx={{ border: "1px ridge gray", width: "100%", borderRadius: "0px" }}>
                  MOVE TO BAG
                </Button> */}
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>}

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
