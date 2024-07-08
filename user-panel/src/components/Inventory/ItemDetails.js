import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Divider, IconButton, TextField, Tooltip, ButtonGroup, Button, Grid, useTheme, Accordion, AccordionSummary, AccordionDetails, CardMedia, Modal, Snackbar, SnackbarContent } from '@mui/material';
import CustomDropdown from './SizeDropdown';
import { AccountCircle, Add, AddSharp, Remove, RemoveSharp, WhatsApp } from '@mui/icons-material';
import Link from 'next/link';
import { FeatureAccordions } from './FeatureAccordions';
import { InventoryAccordion } from './ExtraColorItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImagePopup from '@/modals/imagepopup';
import Image from 'next/image';
import Icons from "../../../public/images/producticons.png";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const ItemDetails = ({ product }) => {
  const theme = useTheme();
  const [quantity, setQuantity] = useState(product.minQuantity || 1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const hasBedsheets = product?.InventoryFitted.length > 0 || product.customFittedInventory.length > 0;
  const [selections, setSelections] = useState({
    selectedOption: hasBedsheets ? '' : 'flat',
    selectedFlatItem: '',
    selectedFittedItem: '',
    selectedFittedDimension: '',
    selectedCustomFittedItem: '',
    selectedUnit: 'inch',
    dimensions: {
      width: '',
      height: '',
      length: ''
    }
  });

  const [cart, setCart] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

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

    if (selections?.selectedOption === '') {
      setSnackbarMessage('Please select a size option before adding to the cart.');
      setOpenSnackbar(true);
      return;
    }
    if (selections?.selectedOption === 'flat' && selections?.selectedFlatItem === '') {
      setSnackbarMessage('Please select a size before adding to the cart.');
      setOpenSnackbar(true);
      return;
    }
    if (selections?.selectedOption === 'fitted' && selections?.selectedFittedDimension
      === '') {
      setSnackbarMessage('Please select dimension before adding to the cart.');
      setOpenSnackbar(true);
      return;
    }
    if (selections?.selectedOption === 'custom' && (selections?.selectedCustomFittedItem === '' || selections?.dimensions?.width === '' || selections?.dimensions?.height === '' || selections?.dimensions?.length === '')) {

      setSnackbarMessage('Please fill all sizes before adding to the cart.');
      setOpenSnackbar(true);
      return;
    }
    console.log('Item added to cart:', selections);
  };

  // Function to handle buying now
  const handleBuyNow = () => {
    // Implement logic to proceed to checkout or buy now action
    console.log('Buying now:', product);
  };

  const productUrl = `${process.env.REACT_APP_BASE_URL}/product/${product.id}`;
  const whatsappMessage = `🌟 Hey, I am interested in placing an international order for this amazing item: ${product.productName}. Could you please provide me with the steps and necessary information? 🛒\n\n🔗 Here is the product link: ${productUrl}\n\nThank you! 🙏`;


  const handleOpenImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };
  return (
    <>
      <CardContent sx={{ padding: "0.5px" }}>
        <Typography variant="h5" gutterBottom sx={{ mt: 1 }}>
          {product?.productName}
        </Typography>
        {/* <Box sx={{
          mt: 0,
          display: 'flex',
          //  alignItems: 'center',
          gap: 2
        }}>
          {product.discountedPrice ? (
            <>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h5" color="error" sx={{ fontWeight: 'bold' }}>
                  {`-${Math.round(((product.sellingPrice - product.discountedPrice) / product.sellingPrice) * 100)}%`}
                </Typography>
                <Typography variant="body2" sx={{ textDecoration: 'line-through', fontSize: '0.75rem' }}>
                  Rs. {product?.sellingPrice?.toFixed(2)}
                </Typography>
              </Box>

              <Typography variant="h5" sx={{ position: 'relative', mt: 0.5 }}>
                <Box component="span" sx={{ position: 'absolute', top: 4, left: '-1ch', fontSize: '0.75rem' }}>₹</Box>
                {product?.discountedPrice?.toFixed(2)}
              </Typography>
            </>
          ) : (
            <Typography variant="h5" sx={{ position: 'relative', mt: 0.5 }}>
              <Box component="span" sx={{ position: 'absolute', top: 4, left: '-1ch', fontSize: '0.75rem' }}>₹</Box>
              {product?.sellingPrice?.toFixed(2)}
            </Typography>
          )}
        </Box> */}

        {product.discountedPrice ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2">
              MRP
            </Typography>
            <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
              ₹{product?.sellingPrice?.toFixed(2)}
            </Typography>
            <Typography variant="h6" sx={{ marginRight: "3px", fontWeight: "bold" }} >
              ₹{product?.discountedPrice?.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="error" sx={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #FF5733 100%, #FFC300 30%)',
              padding: '0px 10px',
              borderRadius: '1px',
              clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)',
              color: "white",
            }}>
              {`${Math.round(((product.sellingPrice - product.discountedPrice) / product.sellingPrice) * 100)}% OFF!`}
            </Typography>
          </Box>
        ) : (
          <Typography variant="h6">
            ₹{product?.sellingPrice?.toFixed(2)}
          </Typography>
        )}
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>
          (MRP inclusive of all taxes)
        </Typography>

        {product?.availability &&
          <Typography variant='body2' sx={{ color: product?.extraOptionOutOfStock ? 'red' : 'green', mb: 1 }}>
            {product?.extraOptionOutOfStock ? "Out of Stock" : "In Stock"}
          </Typography>
        }
        {
          product?.relatedInventories?.length > 0
          &&
          <>
            <Divider sx={{ borderStyle: "dotted", mb: 2 }} />
            <InventoryAccordion relatedInventories={product.relatedInventories} />
          </>
        }

        <Divider sx={{ borderStyle: "dotted", mb: 2 }} />
        <Typography variant="body2" gutterBottom>
          <strong>Category:</strong> {product?.category?.categoryName}
        </Typography>
        <Typography variant='body2' sx={{ fontSize: '0.8rem', mt: 1 }}>
          SKU: {product?.skuId}
        </Typography>
        <Divider sx={{ borderStyle: "dotted", mt: 2, mb: 2 }} />
        <CustomDropdown data={product} selections={selections} setSelections={setSelections} hasBedsheets={hasBedsheets} />

        <Box>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: "bold" }}>
            Quantity:
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              borderRadius: '4px',
              padding: '4px',
              gap: 1,
              width: "40%"
            }}
          >
            <Tooltip title={quantity <= (product.minQuantity || 1) ? 'Minimum quantity reached' : ''}>
              <span>
                <IconButton
                  onClick={handleDecrement}
                  disabled={quantity <= (product.minQuantity || 1)}
                  size='small'
                >
                  <RemoveSharp />
                </IconButton>
              </span>
            </Tooltip>
            <TextField
              variant='standard'
              value={quantity}
              onChange={handleChange}
              inputProps={{
                min: product.minQuantity || 1,
                max: product.maxQuantity || Infinity,
                type: 'text',
                style: { textAlign: 'center' },
              }}
              InputProps={{
                disableUnderline: true,
              }}
              size='small'
              sx={{
                flexGrow: 1,
                border: "none",
              }}
            />
            <Tooltip title={quantity >= (product.maxQuantity || Infinity) ? 'Maximum quantity reached' : ''}>
              <span>
                <IconButton
                  onClick={handleIncrement}
                  disabled={quantity >= (product.maxQuantity || Infinity)}
                  size='small'
                >
                  <AddSharp />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
        <Divider sx={{ borderStyle: "dotted", mt: 2, mb: 2 }} />
        {product?.extraNote &&
          <Typography variant="caption" sx={{
            fontSize: '0.7rem',
            color: 'text.secondary',
            lineHeight: '1',
            padding: 0,
            display: 'block',
            margin: "10px 0px"
          }}
          >
            <strong>Note: </strong>{product?.extraNote}
          </Typography>
        }

        {product?.extraOptionOutOfStock === true ?
          (
            <Grid item xs={12} sx={{ paddingTop: "0px" }}>
              <Button
                onClick={handleAddToCart}
                color="inherit"
                fullWidth
                disabled
                sx={{ backgroundColor: theme.palette.background.contrast }}
              >
                Sold Out
              </Button>
            </Grid>
          ) : (
            <>
              <Card variant="outlined" sx={{ maxWidth: "100%" }}>
                <CardContent sx={{ padding: "10px", '&:last-child': { paddingBottom: "10px" } }}>
                  <Typography gutterBottom variant="h6">
                    International Orders
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: '1', display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "0px" }}>
                    For Order & Shipping Details, Connect with us for personalized assistance on{' '} <br />
                    <Button
                      aria-label="Chat on WhatsApp"
                      href={`https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<WhatsAppIcon />}
                      sx={{
                        color: '#25D366',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        mb: 0
                      }}
                    >
                      WhatsApp
                    </Button>
                  </Typography>
                </CardContent>
              </Card >
              {
                product?.availability === false ?
                  (
                    <>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.9rem',
                          color: 'text.secondary',
                          display: 'flex',
                          flexDirection: "column",
                          mt: 2,
                          mb: 1,
                          lineHeight: "1"
                        }}
                      >
                        Check availability for this product{' '}
                        <Typography
                          sx={{ color: theme.palette.text.text, textDecoration: "underline" }}
                          variant="caption"
                        >
                          <Link href="exchange policy link" target="_blank">
                            {' '}for more details
                          </Link>
                        </Typography>
                      </Typography>
                      <Grid item xs={12} sx={{ paddingTop: "0px" }}>
                        <Button
                          onClick={handleAddToCart}
                          color="inherit"
                          fullWidth
                          sx={{ backgroundColor: theme.palette.background.contrast }}
                        >
                          Check Availability
                        </Button>
                      </Grid>
                    </>
                  )
                  : (
                    <Grid container spacing={1} sx={{ mt: 1, mb: 1 }}>
                      <Grid item xs={6} sx={{ paddingTop: "0px" }}>
                        <Button
                          onClick={handleAddToCart}
                          color="inherit"
                          fullWidth
                          sx={{ backgroundColor: theme.palette.background.contrast }}
                        >
                          Add to Cart
                        </Button>
                      </Grid>
                      <Grid item xs={6} sx={{ paddingTop: "0px" }}>
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
                  )
              }
            </>
          )
        }
        {
          product?.SizeChartMedia?.length > 0 &&
          <Accordion sx={{ mt: 2 }} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Size Guide</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "0px" }}>
              {product?.SizeChartMedia.map(chart => (
                <Card
                  key={chart.id}
                  onClick={() => handleOpenImageModal(`https://ayru-jaipur.s3.amazonaws.com/${chart?.url}`)}
                  sx={{ columnGap: "2px", padding: "0px", boxShadow: "none" }}
                >
                  <CardMedia
                    component="img"
                    image={chart?.url ? `https://ayru-jaipur.s3.amazonaws.com/${chart?.url}` : '/fallback_image_url'}
                    alt="size chart"
                    sx={{
                      objectFit: 'contain',
                      height: "100%",
                      width: "100%"
                    }}
                  />
                </Card>
              ))}
            </AccordionDetails>
          </Accordion>
        }
        <Image src={Icons} alt="Left Image"
          style={{ mt: 2, width: "100%", height: "100%", padding: "10px 5px" }}
        // style={{ position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)', maxWidth: '20%', height: 'auto' }}
        />
        <Divider sx={{ borderStyle: "dotted", mt: 2, mb: 2 }} />
        <FeatureAccordions product={product} />
      </CardContent >

      <Modal open={imageModalOpen} onClose={handleCloseImageModal}>
        <ImagePopup imageUrl={selectedImage} onClose={handleCloseImageModal} />
      </Modal>

      {/* <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.getContrastText(theme.palette.secondary.main),
          borderRadius: "2px",
          maxWidth: 'calc(100vw - 48px)',
        }}
      /> */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      >
        <SnackbarContent style={{
          backgroundColor: theme.palette.background.primary,
          color: "black"
        }}
          message={snackbarMessage}
        />
      </Snackbar>

    </>
  );
};

export default ItemDetails;
