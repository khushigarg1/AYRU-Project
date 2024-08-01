import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Box, Card, CardMedia, Chip, IconButton, Modal, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FavoriteBorderOutlined, FavoriteOutlined, Share } from '@mui/icons-material';
import Cookies from 'js-cookie';
import api from '../../../api';
import { useAuth } from '../../contexts/auth';
import { useRouter } from 'next/navigation';
import { RWebShare } from "react-web-share";
import Instructions from "../../../..../../public/images/instruction.png";
import Image from 'next/image';
import ImagePopup from '@/modals/imagepopup';
import ShareButton from './ShareButton';

export const ProductSlider = ({ itemlist, displayAvailability, discountedPriceToDisplay, sellingPriceToDisplay }) => {
  const theme = useTheme();
  const { openAuthModal, user, wishlistCount, setWishlistCount } = useAuth();
  const [wishlistItems, setWishlistItems] = useState({});
  const token = Cookies.get('token');
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const istablet = useMediaQuery(theme.breakpoints.down("lg"));
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
    slidesToScroll: 1,
    arrows: false,
  };


  const handleShare = async () => {
    const productUrl = `${process.env.REACT_APP_BASE_URL}/${itemlist.id}`;
    const text = `Check out this amazing product: ${itemlist.productName} - ${itemlist.description}. Available now at a discounted price of ${discountedPriceToDisplay} !${productUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: itemlist.productName,
          text: text,
          url: productUrl,
        });
        console.log('Content shared successfully');
      } else {
        alert('Web Share API is not supported in your browser. Please copy the following message and share it manually:\n' + text);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };


  const handleOpenImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };
  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  const getProductShareText = () => {
    const productName = itemlist.productName;
    const description = itemlist.description;
    const price = discountedPriceToDisplay ? `Now available at a discounted price of $${discountedPriceToDisplay}! (Original price: $${sellingPriceToDisplay})` : `Price: $${sellingPriceToDisplay}`;
    return `Check out this amazing product: ${productName} 🌟\n\n${description}\n\n${price}\n\n🛒 Don't miss out! Click the link to view more details and make a purchase!`;
  };

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        {(discountedPriceToDisplay != 0 && discountedPriceToDisplay != null) && (
          <Chip
            label={
              <div style={{ textAlign: 'center' }}>
                <Typography component="span" sx={{ lineHeight: 1, fontWeight: "bolder" }}>
                  {`${((sellingPriceToDisplay - discountedPriceToDisplay) / sellingPriceToDisplay * 100).toFixed(0)}%`}
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

        {displayAvailability && (
          <Chip
            label={
              <div style={{ textAlign: 'center' }}>
                <Typography variant="caption" component="h6" sx={{ lineHeight: 1, fontWeight: "bolder", color: "white" }}>
                  Sold Out
                </Typography>
                {/* <Typography variant="caption" component="div" sx={{ lineHeight: 1, fontWeight: "bolder" }}>
                Out
              </Typography> */}
              </div>
            }
            color="secondary"
            size="small"
            sx={{
              position: 'absolute',
              top: 6,
              right: 4,
              zIndex: 1,
              padding: '7px 2px',
              // display: 'flex',
              // flexDirection: 'column',
              // alignItems: 'center',
              // height: '50px',
              // width: '50px',
              borderRadius: '15px',
              fontSize: '1px',
              fontWeight: '800',
              backgroundColor: "#cf2e2e"
            }}
          />
        )}
        <Slider {...settings}>
          {itemlist?.Media.map((item) => (
            <Box key={item.id} sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                onClick={() => handleOpenImageModal(`https://ayru-jaipur.s3.amazonaws.com/${item?.url}`)}
                image={`https://ayru-jaipur.s3.amazonaws.com/${item.url}`}
                alt={item.alt}
                style={{ objectFit: 'contain', cursor: "pointer" }}
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
          // onClick={handleShare}
          sx={{ position: 'absolute', bottom: 90, right: 8, zIndex: 1, backgroundColor: 'white', '&:hover': { backgroundColor: 'lightgray' } }}
        >
          {/* <Share /> */}
          <ShareButton
            imageUrl={`https://ayru-jaipur.s3.amazonaws.com/${itemlist?.Media[0]?.url}`}
            title={itemlist.productName}
            text={getProductShareText()}
            // url={`www.ayrujaipur.com`}
            url={`${process.env.NEXT_PUBLIC_BASE_URL}/shop/${itemlist.id}`}
          />
        </IconButton>
      </Box >
      {!istablet &&
        <Image src={Instructions} alt="Image"
          style={{ marginTop: "20%", width: "35rem", height: "35rem", padding: "5px" }}
        // style={{ position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)', maxWidth: '20%', height: 'auto' }}
        />
      }

      <Modal open={imageModalOpen} onClose={handleCloseImageModal}>
        <ImagePopup imageUrl={selectedImage} onClose={handleCloseImageModal} />
      </Modal>

    </>
  );
};
