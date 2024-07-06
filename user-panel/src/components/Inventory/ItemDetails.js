import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Divider, IconButton, TextField, Tooltip, ButtonGroup, Button, Grid, useTheme } from '@mui/material';
import CustomDropdown from './SizeDropdown';
import { Add, Remove } from '@mui/icons-material';
import Link from 'next/link';
import { FeatureAccordions } from './FeatureAccordions';

const ItemDetails = ({ product }) => {
  const theme = useTheme();
  const [quantity, setQuantity] = useState(product.minQuantity || 1);

  const handleDecrement = () => {
    if (quantity > (product.minQuantity || 1)) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < (product.maxQuantity || Infinity)) {
      setQuantity(quantity + 1);
    }
  };

  const handleChange = (e) => {
    const value = Number(e.target.value);
    if (value >= (product.minQuantity || 1) && value <= (product.maxQuantity || Infinity)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    // Implement logic to add item to cart
    console.log('Item added to cart:', product);
  };

  // Function to handle buying now
  const handleBuyNow = () => {
    // Implement logic to proceed to checkout or buy now action
    console.log('Buying now:', product);
  };

  const productUrl = `${process.env.REACT_APP_BASE_URL}/product/${product.id}`;
  const whatsappMessage = `🌟 Hey, I am interested in placing an international order for this amazing item: ${product.productName}. Could you please provide me with the steps and necessary information? 🛒\n\n🔗 Here is the product link: ${productUrl}\n\nThank you! 🙏`;

  return (
    <CardContent sx={{ padding: "0.5px" }}>
      <Typography variant="h5" gutterBottom>
        {product?.productName}
      </Typography>
      {product.discountedPrice ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ textDecoration: 'line-through' }}>
            Rs.{product?.sellingPrice?.toFixed(2)}
          </Typography>
          <Typography variant="h6" >
            Rs.{product?.discountedPrice?.toFixed(2)}
          </Typography>
        </Box>
      ) : (
        <Typography variant="h6">
          Rs.{product?.sellingPrice?.toFixed(2)}
        </Typography>
      )}
      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
        (MRP incl. all taxes)
      </Typography>
      <Typography variant='body2' sx={{ fontSize: '0.75rem' }}>
        SKU: {product?.skuId}
      </Typography>
      <Typography variant='body2' sx={{ color: product?.extraOptionOutOfStock ? 'red' : 'green' }}>
        {product?.extraOptionOutOfStock === true ? "Out of Stock" : "In Stock"}
      </Typography>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Typography variant="body2" gutterBottom>
        <strong>Category:</strong> {product?.category?.categoryName}
      </Typography>
      <CustomDropdown data={product} />
      {product?.extraNote &&
        <Typography variant="caption" sx={{
          fontSize: '0.7rem',
          color: 'text.secondary',
          marginTop: 1,
          lineHeight: '1',
          padding: 0,
          margin: 0,
          display: 'block'
        }}
        >
          Note: {product?.extraNote}
        </Typography>
      }
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* <Typography variant="body2" gutterBottom>
          Quantity:
        </Typography> */}
        <Tooltip title={quantity <= (product.minQuantity || 1) ? 'Minimum quantity reached' : ''}>
          <span>
            <IconButton
              onClick={handleDecrement}
              disabled={quantity <= (product.minQuantity || 1)}
            >
              <Remove />
            </IconButton>
          </span>
        </Tooltip>
        <TextField
          value={quantity}
          onChange={handleChange}
          inputProps={{
            min: product.minQuantity || 1,
            max: product.maxQuantity || Infinity,
            type: 'text',
            style: { textAlign: 'center' }
          }}
          size='small'
          sx={{ width: "100%", height: 50, mt: 1 }}
        />
        <Tooltip title={quantity >= (product.maxQuantity || Infinity) ? 'Maximum quantity reached' : ''}>
          <span>
            <IconButton
              onClick={handleIncrement}
              disabled={quantity >= (product.maxQuantity || Infinity)}
            >
              <Add />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Typography
        variant="caption"
        sx={{
          fontSize: '0.7rem',
          color: 'text.secondary',
          lineHeight: '1',
          margin: 0,
          display: 'block',
          mt: 1
        }}
      >
        For international orders, click this link:
        {' '}
        <a
          aria-label="Chat on WhatsApp"
          href={`https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#25D366', fontWeight: 'bold', textDecoration: 'none' }}
        >
          WhatsApp me
        </a>
      </Typography>

      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <Button
            onClick={handleAddToCart}
            color="inherit"
            fullWidth
            sx={{ backgroundColor: theme.palette.background.contrast }}
          >
            Add to Cart
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            onClick={handleBuyNow}
            color="inherit"
            fullWidth
            sx={{ backgroundColor: theme.palette.background.contrast }}
          >
            Buy Now
          </Button>
        </Grid>
      </Grid>
      <FeatureAccordions product={product} />
    </CardContent >
  );
};

export default ItemDetails;
