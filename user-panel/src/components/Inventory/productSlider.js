import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Box, Card, CardMedia, Chip, IconButton, Typography, useTheme } from '@mui/material';
import { FavoriteBorderOutlined, FavoriteOutlined, Share } from '@mui/icons-material';
import Cookies from 'js-cookie';
import api from '../../../api';
import { useAuth } from '../../contexts/auth';
import { useRouter } from 'next/navigation';
import { RWebShare } from "react-web-share";

const ProductSlider = ({ itemlist }) => {
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

      if (wishlistItems[itemlist.id]) {
        await api.delete(`/wishlist/${wishlistItems[itemlist.id]}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWishlistItems(prevItems => {
          const newItems = { ...prevItems };
          delete newItems[itemlist.id];
          return newItems;
        });
        setWishlistCount(prevCount => prevCount - 1);
        console.log(`Removed ${itemlist.productName} from wishlist`);
      } else {
        const response = await api.post('/wishlist', { inventoryId: itemlist.id, userId: user?.id }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWishlistItems(prevItems => ({
          ...prevItems,
          [itemlist.id]: response.data.data.id
        }));
        setWishlistCount(prevCount => prevCount + 1);
        console.log(`Added ${itemlist.productName} to wishlist`);
      }
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  const handleShare = () => {
    try {
      if (navigator.share) {
        navigator.share({
          url: `${process.env.REACT_APP_BASE_URL}/${itemlist.id}`,
          title: itemlist.productName,
          text: `Check out this product: ${itemlist.productName} - ${itemlist.description}`,
        }).catch(error => console.error('Error sharing:', error));
      } else {
        console.log('Web Share API is not supported in your browser.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  return (
    <Box sx={{ position: 'relative' }}>
      {itemlist?.discountedPrice && (
        <Chip
          label={
            <div style={{ textAlign: 'center' }}>
              <Typography component="span" sx={{ lineHeight: 1, fontWeight: "bolder" }}>
                {`${((itemlist.sellingPrice - itemlist.discountedPrice) / itemlist.sellingPrice * 100).toFixed(0)}%`}
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
            top: 6,
            left: 4,
            zIndex: 1,
            padding: '4px 2px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '50px',
            width: '50px',
            borderRadius: '50%',
            fontSize: '1px',
            fontWeight: '800',
          }}
        />
      )}
      <Slider {...settings}>
        {itemlist?.Media.map((item) => (
          <Box key={item.id} sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              image={`https://ayru-jaipur.s3.amazonaws.com/${item.url}`}
              alt={item.alt}
              style={{ objectFit: 'contain' }}
            />
          </Box>
        ))}
      </Slider>
      <IconButton
        aria-label="Add to Wishlist"
        onClick={handleToggleWishlist}
        sx={{ position: 'absolute', bottom: 40, right: 8, zIndex: 1, backgroundColor: 'white', '&:hover': { backgroundColor: 'lightgray' } }}
      >
        {wishlistItems[itemlist?.id] ? <FavoriteOutlined style={{ color: 'red' }} /> : <FavoriteBorderOutlined />}
      </IconButton>
      <IconButton
        aria-label="Share"
        onClick={handleShare}
        sx={{ position: 'absolute', bottom: 90, right: 8, zIndex: 1, backgroundColor: 'white', '&:hover': { backgroundColor: 'lightgray' } }}
      >
        <Share />
      </IconButton>
    </Box >
  );
};

export default ProductSlider;
