import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Box, Chip, useTheme } from '@mui/material';
import { FavoriteBorderOutlined, FavoriteOutlined } from '@mui/icons-material';
import Cookies from 'js-cookie';
import api from '../../../api';
import { useAuth } from '../../contexts/auth';
import { useRouter } from 'next/navigation';

const InventoryItem = ({ item }) => {
  const theme = useTheme();
  const { openAuthModal, user, wishlistCount, setWishlistCount } = useAuth();
  const [wishlistItems, setWishlistItems] = useState({});
  const token = Cookies.get('token');
  const router = useRouter();

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

  const handleToggleWishlist = async () => {
    try {
      if (!token) {
        openAuthModal();
        return;
      }

      if (wishlistItems[item.id]) {
        await api.delete(`/wishlist/${wishlistItems[item.id]}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWishlistItems(prevItems => {
          const newItems = { ...prevItems };
          delete newItems[item.id];
          return newItems;
        });
        setWishlistCount(prevCount => prevCount - 1);
        console.log(`Removed ${item.productName} from wishlist`);
      } else {
        const response = await api.post('/wishlist', { inventoryId: item.id, userId: user?.id }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWishlistItems(prevItems => ({
          ...prevItems,
          [item.id]: response.data.data.id
        }));
        setWishlistCount(prevCount => prevCount + 1);
        console.log(`Added ${item.productName} to wishlist`);
      }
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
    }
  };

  return (
    <Card sx={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}
      onClick={() => router.push(`/shop/${item?.id}`)}
    >
      <Box sx={{ position: 'relative' }}>
        {item.discountedPrice && (
          <Chip
            label={`-${((item.costPrice - item.discountedPrice) / item.costPrice * 100).toFixed(0)}%`}
            color="secondary"
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          />
        )}
        <CardMedia
          component="img"
          image={`https://ayru-jaipur.s3.amazonaws.com/${item?.Media[0]?.url}`}
          // image={"https://ayru-jaipur.s3.ap-south-1.amazonaws.com/1719728584132-1681210423276-Magarpatta.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXQI4DHNFFJZ44EFQ%2F20240630%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240630T085117Z&X-Amz-Expires=900&X-Amz-Signature=8eea213abd2e69937bccfc57540603d4efb553518633c6fdf16f63cf1e7fdcba&X-Amz-SignedHeaders=host&x-id=GetObject"}
          height="200"
          alt={item.productName}
        />
        <IconButton
          aria-label="Add to Wishlist"
          onClick={handleToggleWishlist}
          sx={{ position: 'absolute', bottom: 8, right: 8, zIndex: 1, backgroundColor: 'white', '&:hover': { backgroundColor: 'lightgray' } }}
        >
          {wishlistItems[item.id] ? <FavoriteOutlined style={{ color: 'red' }} /> : <FavoriteBorderOutlined />}
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {item.productName}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Category: {item?.category?.categoryName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {item.description}
        </Typography>
        {item.discountedPrice ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ textDecoration: 'line-through' }}>
              ₹{item.costPrice.toFixed(2)}
            </Typography>
            <Typography variant="body1" color={theme?.palette?.text?.contrastText}>
              ₹{item?.discountedPrice?.toFixed(2)}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1">
            ₹{item?.costPrice?.toFixed(2)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryItem;
