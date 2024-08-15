"use client"
import React, { Suspense, useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardActionArea, CardContent, CardMedia, Button, useTheme, IconButton, Divider, CircularProgress, useMediaQuery, Chip } from '@mui/material';
import Link from 'next/link'; // Import Link from next/link for Next.js routing
import api from '../../../api';
import { useAuth } from '@/contexts/auth';
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter } from 'next/navigation';

const WishlistPage = () => {
  const { openAuthModal, user, wishlistCount, setWishlistCount } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const theme = useTheme();
  const [wishlsitId, setWishlistIds] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const handleLogin = () => {
    openAuthModal();
    return;
  }
  const fetchWishlistItems = async () => {
    try {
      if (user?.id) {

        setLoading(true);
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
    } finally {
      setLoading(false);
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


  if (loading) {
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
    )
  }

  return (
    <Box p={1} style={{
      paddingLeft: isMobile ? "1%" : "8%", paddingRight: isMobile ? "1%" : "8%", backgroundColor: "#F0F0F0",
      '&:focus': {
        outline: 'none',
        boxShadow: 'none',
      },
      '&:active': {
        backgroundColor: 'inherit',
      },
      paddingBottom: "13px",
      minHeight: "70vh"
    }}>
      {/* <Typography variant="h4" gutterBottom>
        Wishlist
      </Typography> */}
      {
        wishlistItems.length === 0 && (
          <Typography variant="body2" sx={{ height: "100%", fontSize: "20px", padding: "20px" }}>
            {/* Your wishlist is empty. <strong><Link href="/shop">Browse products</Link></strong> to add items or <strong style={{ cursor: "pointer" }} onClick={handleLogin}>Login</strong> to see your saved items. */}
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={2} textAlign="center" mt={16} mb={16} >
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', pt: 2 }}>
                Your Wishlist is Currently Empty
              </Typography>
              <Typography variant="body1" gutterBottom>
                It looks like you haven't added any items to your wishlist yet. Don't worry, we've got plenty of amazing products waiting for you!
              </Typography>
              <Box my={2}>
                <Button variant="contained" color="primary" component={Link} href="/shop">
                  Browse Products
                </Button>
              </Box>
              <Typography variant="body1" gutterBottom>
                If you have previously saved items, please
                <strong style={{ cursor: "pointer", color: "#0070f3" }} onClick={handleLogin}>
                  &nbsp;Login {' '}
                </strong>
                to your account to view them.
              </Typography>
            </Box>
          </Typography>
        )
      }
      {
        wishlistItems.length > 0 &&
        <>
          < Box display="flex" alignItems="center" justifyContent="center" >
            <Typography variant='h4' gutterBottom style={{ fontWeight: "bold" }} pt={2}>
              Wishlist Items
            </Typography>
          </Box >
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
                      {item?.Inventory?.discountedPrice && (
                        <Chip
                          label={
                            <div style={{ textAlign: 'center' }}>
                              <Typography variant="caption" component="span" sx={{ lineHeight: 1, fontWeight: "bolder" }}>
                                {`${((item?.Inventory?.sellingPrice - item?.Inventory?.discountedPrice) / item?.Inventory?.sellingPrice * 100).toFixed(0)}%`}
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
                      <CardMedia
                        component="img"
                        height="300"
                        image={`https://ayrujaipur.s3.amazonaws.com/${item?.Inventory?.Media[0]?.url}`}
                        alt={item.Inventory.productName}
                        onClick={() => router.push(`/shop/${item?.Inventory?.id}`)}
                        sx={{
                          objectFit: 'fit',
                          height: "213px",
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
                    <CardContent sx={{ flexGrow: 1, padding: "12px 8px", '&:last-child': { paddingBottom: "13px" } }}>
                      <Typography variant="body1" gutterBottom sx={{ lineHeight: "1", fontWeight: "bolder", fontSize: "16px" }}>
                        {item?.Inventory?.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: "14px" }}>
                        <strong>Category: </strong>{item?.Inventory?.Category?.categoryName}
                      </Typography>
                      {item?.Inventory?.discountedPrice ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ textDecoration: 'line-through', fontSize: "12px" }}>
                            Rs.{item?.Inventory?.sellingPrice}
                          </Typography>
                          <Typography variant="body1" color={theme?.palette?.text?.contrastText} sx={{ fontSize: "13px", fontWeight: "bold" }}>
                            Rs.{item?.Inventory?.discountedPrice}
                          </Typography>
                          {/* <Typography variant="body2" color="error" sx={{
                            background: 'inherit',
                            color: "black", fontSize: "12px"
                          }}>
                            {`(${Math.round(((item?.Inventory?.sellingPrice - item?.Inventory?.discountedPrice) / item?.Inventory?.sellingPrice) * 100)}% OFF)`}
                          </Typography> */}
                        </Box>
                      ) : (
                        <Typography variant="body1" sx={{ fontSize: "13px", fontWeight: "bold" }}>
                          Rs.{item?.Inventory?.sellingPrice}
                        </Typography>
                      )}
                      <Typography variant='body1' sx={{ color: item?.Inventory?.extraOptionOutOfStock ? 'red' : 'green', fontSize: "13px" }}>
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
        </>
      }

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

const Wishlist = () => {
  return (
    <Suspense
      fallback={
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
      }
    >
      <WishlistPage />
    </Suspense>
  );
};

export default Wishlist;
