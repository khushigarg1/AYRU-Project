import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Divider, IconButton, TextField, Tooltip, ButtonGroup, Button, Grid, useTheme, Accordion, AccordionSummary, AccordionDetails, CardMedia, Modal, Snackbar, SnackbarContent, Popover } from '@mui/material';
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
import { ProductSlider } from './productSlider';
import { useAuth } from '@/contexts/auth';
import Cookies from 'js-cookie';
import api from '../../../api';
import RequestAvailabilityModal from './AvailabilityModal';

const ItemDetails = ({ product, queryParams }) => {
  //-------------------------------------------------------------------------------

  const [anchorEl, setAnchorEl] = useState(null);
  const [quantityOpen, setQuantityOpen] = useState(false);
  const [quantityMessage, setQuantityMessage] = useState('');

  const hasBedsheets = product?.InventoryFitted.length > 0 || product.customFittedInventory.length > 0;
  const [selections, setSelections] = useState({
    selectedOption: queryParams?.sizeOption || 'flat',
    selectedFlatItem: Number(queryParams?.flatId) || '',
    selectedFittedItem: Number(queryParams?.fittedId) || '',
    selectedCustomFittedItem: Number(queryParams?.customId) || '',
    selectedUnit: queryParams?.unit || 'inch',
    dimensions: {
      width: queryParams?.width || '',
      height: queryParams?.height || '',
      length: queryParams?.length || ''
    }
  });
  const selectedFlatItem = selections?.selectedFlatItem;
  const selectedFittedItem = selections?.selectedFittedItem;
  const selectedCustomFittedItem = selections?.selectedCustomFittedItem;
  console.log(selections, selectedFlatItem, selectedFittedItem, selectedCustomFittedItem);

  const [discountedPriceToDisplay, setDiscountedPriceToDisplay] = useState(product?.discountedPrice?.toFixed(2));
  const [sellingPriceToDisplay, setSellingPriceToDisplay] = useState(product?.sellingPrice?.toFixed(2));
  const [displayQuantity, setDisplayQuantity] = useState(product?.quantity);
  const [quantity, setQuantity] = useState(product?.quantity);
  const [displayMinQuantity, setDisplayMinQuantity] = useState(0);
  const [displayMaxQuantity, setDisplayMaxQuantity] = useState(0);
  const [displayAvailability, setDisplayAvailability] = useState(product?.extraOptionOutOfStock);

  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [availabilityOpen, setAvailabilityModal] = useState(false);
  const [availabilitystatus, setAvailabilityStatus] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { openAuthModal, user, cartCount, setCartCount } = useAuth();
  const [cartItems, setcartItems] = useState({});
  const token = Cookies.get('token');

  const updateProductDetails = () => {
    // console.log("calleddd useeffect", selectedFlatItem, selectedCustomFittedItem, selectedFittedItem);
    if (selections.selectedFlatItem && product?.InventoryFlat) {
      const selectedFlat = product.InventoryFlat.find(item => item.flatId === selections.selectedFlatItem);
      if (selectedFlat) {
        setDiscountedPriceToDisplay(selectedFlat.discountedPrice.toFixed(2));
        setSellingPriceToDisplay(selectedFlat.sellingPrice.toFixed(2));
        setDisplayQuantity(selectedFlat.minQuantity);
        setQuantity(selectedFlat.quantity);
        setDisplayMinQuantity(selectedFlat.minQuantity);
        setDisplayMaxQuantity(selectedFlat.maxQuantity);
        setDisplayAvailability(selectedFlat.quantity === 0);
      }
    } else if (selections.selectedFittedItem && product?.InventoryFitted) {
      const selectedFitted = product.InventoryFitted.find(item => item.fittedId === selections.selectedFittedItem);
      if (selectedFitted) {
        setDiscountedPriceToDisplay(selectedFitted.discountedPrice.toFixed(2));
        setSellingPriceToDisplay(selectedFitted.sellingPrice.toFixed(2));
        setDisplayQuantity(selectedFitted?.minQuantity);
        setQuantity(selectedFitted.quantity);
        setDisplayMinQuantity(selectedFitted.minQuantity);
        setDisplayMaxQuantity(selectedFitted.maxQuantity);
        setDisplayAvailability(selectedFitted.quantity === 0);
      }
    } else if (selections.selectedCustomFittedItem && product?.customFittedInventory) {
      const selectedCustomFitted = product.customFittedInventory.find(item => item?.InventoryFlat?.flatId === selections.selectedCustomFittedItem);

      if (selectedCustomFitted) {
        setDiscountedPriceToDisplay(selectedCustomFitted.discountedPrice.toFixed(2));
        setSellingPriceToDisplay(selectedCustomFitted.sellingPrice.toFixed(2));
        setDisplayQuantity(selectedCustomFitted.InventoryFlat?.minQuantity);
        setQuantity(selectedCustomFitted.InventoryFlat.quantity);
        setDisplayMinQuantity(selectedCustomFitted.InventoryFlat.minQuantity);
        setDisplayMaxQuantity(selectedCustomFitted.InventoryFlat.maxQuantity);
        setDisplayAvailability(selectedCustomFitted.InventoryFlat.quantity === 0);
      }
    }
    console.log("called", selections?.selectedFlatItem, selectedFlatItem, typeof (selections?.selectedFlatItem), typeof (selectedFlatItem), displayQuantity);

  };

  const getAvailabilityStatus = async () => {
    try {
      const token = Cookies.get("token");
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const response = await api.get(`availability/${product?.id}`);
      const status = response?.data?.data?.status;

      setAvailabilityStatus(status);
      console.log("status", status, availabilitystatus, product?.availability);
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  useEffect(() => {
    updateProductDetails();
    getAvailabilityStatus();

  }, [])
  useEffect(() => {

    updateProductDetails();
    // }, [selections, product]);
  }, [selections, queryParams])
  //-------------------------------------------------------------------------------

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDecrement = (event) => {
    setAnchorEl(event.currentTarget);
    if (displayQuantity > (displayMinQuantity || 1)) {
      setDisplayQuantity(displayQuantity - 1);
    }
    else {
      handleOpenPopover(event)
      setQuantityMessage("Minimum quantity reached")
    }
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);

  };

  const open = Boolean(anchorEl);
  const id = open ? 'quantity-popover' : undefined;

  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  const handleIncrement = (event) => {
    setAnchorEl(event.currentTarget);

    if (displayQuantity < (displayMaxQuantity || Infinity)) {
      setDisplayQuantity(displayQuantity + 1);
    }
    else {
      handleOpenPopover(event)
      setQuantityMessage("Maximum quantity reached")
    }
  };

  const handleChange = (e) => {
    const value = Number(e.target.value);
    if (value >= (displayMinQuantity || 1) && value <= (displayMaxQuantity || Infinity)) {
      setDisplayQuantity(value);
    }
  };
  //-------------------------------------------------------------------------------
  useEffect(() => {
    const fetchcartStatus = async () => {
      try {
        if (token) {
          const response = await api.get(`/cart/user`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const cartItemsData = response.data.data?.userCart;
          setCartCount(cartItemsData.length);
          const cartMap = cartItemsData.reduce((acc, cartItem) => {
            acc[cartItem.inventoryId] = cartItem.id;
            return acc;
          }, {});
          setcartItems(cartMap);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    if (user && user.id && token) {
      fetchcartStatus();
    }
  }, [token, user, setCartCount]);

  const getPricesBasedOnSizeOption = (sizeOption, product) => {
    let sellingPrice = 0;
    let costPrice = 0;
    let discountedPrice = 0;

    switch (sizeOption) {
      case 'flat':
        const selectedFlat = product.InventoryFlat.find(item => item?.flatId === selectedFlatItem);
        sellingPrice = selectedFlat ? selectedFlat.sellingPrice : 0;
        costPrice = selectedFlat ? selectedFlat.costPrice : 0;
        discountedPrice = selectedFlat ? selectedFlat.discountedPrice : 0;
        break;

      case 'fitted':
        const selectedFitted = product.InventoryFitted.find(item => item?.fittedId === selectedFittedItem);
        sellingPrice = selectedFitted ? selectedFitted.sellingPrice : 0;
        costPrice = selectedFitted ? selectedFitted.costPrice : 0;
        discountedPrice = selectedFitted ? selectedFitted.discountedPrice : 0;
        break;

      case 'custom':
        const selectedCustomFitted = product.customFittedInventory.find(item => item?.InventoryFlat?.flatId === selectedCustomFittedItem);
        sellingPrice = selectedCustomFitted ? selectedCustomFitted.sellingPrice : 0;
        costPrice = selectedCustomFitted ? selectedCustomFitted.costPrice : 0;
        discountedPrice = selectedCustomFitted ? selectedCustomFitted.discountedPrice : 0;
        break;

      default:
        break;
    }

    return { sellingPrice, costPrice, discountedPrice };
  };


  const handleAddToCart = async () => {
    // console.log(selections);
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
    if (selections?.selectedOption === 'fitted' && selections?.selectedFittedItem
      === '') {
      setSnackbarMessage('Please select size before adding to the cart.');
      setOpenSnackbar(true);
      return;
    }
    if (selections?.selectedOption === 'custom' && (selections?.selectedCustomFittedItem === '' || selections?.dimensions?.width === '' || selections?.dimensions?.height === '' || selections?.dimensions?.length === '')) {
      setSnackbarMessage('Please fill all dimensions before adding to the cart.');
      setOpenSnackbar(true);
      return;
    }


    try {
      if (!token) {
        openAuthModal();
        return;
      }

      const cartItemExists = !!cartItems[product.id];

      const selectedFlat = await product.InventoryFlat.find(item => item?.flatId === selectedFlatItem);
      const selectedFitted = await product.InventoryFitted.find(item => item?.fittedId === selectedFittedItem);
      const selectedCustomFitted = await product.customFittedInventory.find(item => item?.InventoryFlat?.flatId === selectedCustomFittedItem);
      const cartData = {
        inventoryId: product.id,
        // userId: user?.id,
        quantity: displayQuantity || 1,
        flatId: selectedFlatItem || null,
        fittedId: selectedFittedItem || null,
        customId: selectedCustomFittedItem || null,
        // flatId: selectedFlat ? parseInt(selectedFlat.id) : null,
        // fittedId: selectedFitted ? parseInt(selectedFitted.id) : null,
        // customId: selectedCustomFitted ? parseInt(selectedCustomFitted.id) : null,
        ...getPricesBasedOnSizeOption(selections?.selectedOption, product),
        sizeOption: selections?.selectedOption,
        selectedFlatItem: selectedFlat?.Flat?.name + selectedFlat?.Flat?.size,
        selectedFittedItem: selectedFitted?.Fitted?.name,
        selectedCustomFittedItem: selectedCustomFitted?.InventoryFlat?.Flat?.name,
        unit: selections?.selectedUnit,
        length: parseFloat(selections?.dimensions?.length),
        width: parseFloat(selections?.dimensions?.width),
        height: parseFloat(selections?.dimensions?.height)
      };

      const response = await api.post('/cart', cartData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setcartItems(prevItems => ({
        ...prevItems,
        [product.id]: response.data.data.id
      }));
      setCartCount(prevCount => prevCount + 1);
      setSnackbarMessage(`${product.productName} added to cart`);
      setOpenSnackbar(true);
      // }
    } catch (error) {
      console.error('Error toggling cart status:', error);
    }
  };

  //-------------------------------------------------------------------------------
  const handleBuyNow = () => {
    // Implement logic to proceed to checkout or buy now action
    console.log('Buying now:', product);
  };

  //-------------------------------------------------------------------------------
  const productUrl = `${process.env.REACT_APP_BASE_URL}/shop/${product.id}`;
  const whatsappMessage = `Hi there!

Hi, I'd like to place an international order for this amazing item: ${product.productName}.

Here’s the product link: ${productUrl}

My details are here:
Country:
State:
City:
Zip Code:


Could you please provide details on the process, shipping costs, and delivery times?
Thank you so much!`;

  //-------------------------------------------------------------------------------
  const handleOpenImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  const handleCloseAvailabilityModal = () => {
    setAvailabilityModal(false);
  };

  return (
    <>
      <Box my={1} sx={{ fontFamily: theme.palette.text.font }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ProductSlider itemlist={product} displayAvailability={displayAvailability} discountedPriceToDisplay={discountedPriceToDisplay} sellingPriceToDisplay={sellingPriceToDisplay} sx={{ fontFamily: theme.palette.text.font }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CardContent sx={{ padding: "0.5px" }}>
              <Typography variant="h5" gutterBottom sx={{ mt: 1 }}>
                {product?.productName}
              </Typography>
              {discountedPriceToDisplay && discountedPriceToDisplay !== "0.00" && discountedPriceToDisplay !== 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2">
                    MRP
                  </Typography>
                  <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                    ₹{sellingPriceToDisplay}
                  </Typography>
                  <Typography variant="h6" sx={{ marginRight: "3px", fontWeight: "bold" }} >
                    ₹{discountedPriceToDisplay}
                  </Typography>
                  <Typography variant="body2" color="error" sx={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #FF5733 100%, #FFC300 30%)',
                    padding: '0px 10px',
                    borderRadius: '1px',
                    clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)',
                    color: "white",
                  }}>
                    {`${Math.round(((sellingPriceToDisplay - discountedPriceToDisplay) / sellingPriceToDisplay) * 100)}% OFF!`}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h6">
                  ₹{sellingPriceToDisplay}
                </Typography>
              )}
              <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>
                (MRP inclusive of all taxes)
              </Typography>

              {product?.availability &&
                <Typography variant='body2' sx={{ color: displayAvailability ? '#cf2e2e' : 'green', mb: 1 }}>
                  {displayAvailability ? "Out of Stock" : "In Stock"}
                </Typography>
                // <Typography variant='body2' sx={{ color: product?.extraOptionOutOfStock ? 'red' : 'green', mb: 1 }}>
                //   {product?.extraOptionOutOfStock ? "Out of Stock" : "In Stock"}
                // </Typography>
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
                <strong>Category:</strong> {product?.Category?.categoryName}
              </Typography>
              <Typography variant='body2' >
                <strong>SKU:</strong> {product?.skuId}
              </Typography>
              <Divider sx={{ borderStyle: "dotted", mt: 2, mb: 2 }} />
              {product?.availability === false ?
                '' :
                (quantity === 0 ? (
                  <Typography variant="caption" sx={{
                    fontSize: '1rem',
                    color: "#cf2e2e",
                    lineHeight: '1',
                    padding: 0,
                    display: 'block',
                    margin: "10px 0px"
                  }}
                  >
                    Sold Out
                  </Typography>)
                  : (
                    <Typography variant="caption" sx={{
                      fontSize: '1rem',
                      color: displayAvailability ? 'green' : '#cf2e2e',
                      lineHeight: '1',
                      padding: 0,
                      display: 'block',
                      margin: "10px 0px"
                    }}
                    >
                      Only {quantity} units left
                    </Typography>
                  )
                )
              }
              <CustomDropdown data={product} selections={selections} setSelections={setSelections} hasBedsheets={hasBedsheets} />

              <Box>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: "bold" }}>
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
                  {/* <Tooltip title={displayQuantity <= (displayMinQuantity || 1) ? 'Minimum quantity reached' : ''}> */}
                  <span>
                    <IconButton
                      onClick={(event) => handleDecrement(event)}
                      // disabled={displayQuantity <= (displayMinQuantity || 1)}
                      size='small'
                    >
                      <RemoveSharp />
                    </IconButton>
                  </span>
                  {/* </Tooltip> */}
                  <TextField
                    variant='standard'
                    value={displayQuantity}
                    // onChange={handleChange}
                    // disabled
                    inputProps={{
                      min: displayMinQuantity || 1,
                      max: displayMaxQuantity || Infinity,
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
                  {/* <Tooltip title={displayQuantity >= (displayMaxQuantity || Infinity) ? 'Maximum quantity reached' : ''}> */}
                  <span>
                    <IconButton
                      onClick={(event) => handleIncrement(event)}
                      // disabled={displayQuantity >= (displayMaxQuantity || Infinity)}
                      size='small'
                    >
                      <AddSharp />
                    </IconButton>
                  </span>
                  {/* </Tooltip> */}
                </Box>
                <Popover
                  // id={id}
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClosePopover}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}

                  PaperProps={{
                    sx: {
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      boxShadow: 3,
                      p: 1.2,
                    },
                  }}
                >
                  <Typography variant='body2' sx={{ fontSize: "10px", color: "#fff", fontWeight: 'bold' }}>
                    {quantityMessage}
                  </Typography>
                </Popover>

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

              {/* {product?.extraOptionOutOfStock === true ? */}
              {displayAvailability === true ?
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
                        <Typography variant="body2" sx={{ lineHeight: '1', display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "0px", fontsize: "0.8rem" }}>
                          For International Order & Shipping Details, Connect with us for personalized assistance on{' '} <br />
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

                    {product?.availability === false && availabilitystatus !== "approved" ? (
                      availabilitystatus === "rejected" || !availabilitystatus ? (
                        <>
                          {/* <Typography
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
                          </Typography> */}
                          <Grid item xs={12} sx={{ paddingTop: "0px" }}>
                            <Button
                              onClick={() => { setAvailabilityModal(true) }}
                              color="inherit"
                              fullWidth
                              sx={{ backgroundColor: theme.palette.background.contrast }}
                            >
                              Check Availability
                            </Button>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid item xs={12} sx={{ paddingTop: "0px" }}>
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
                              Your request for availability is pending. We will notify you promptly.
                            </Typography>

                            <Button
                              color="inherit"
                              disabled
                              fullWidth
                              sx={{ backgroundColor: theme.palette.background.contrast }}
                            >
                              Reuest Pending for availability
                            </Button>
                          </Grid>
                        </>
                      )
                    ) : (
                      <Grid container spacing={1} sx={{ mt: 1, mb: 1 }}>
                        <Grid item xs={12} sx={{ paddingTop: "0px" }}>
                          <Button
                            onClick={handleAddToCart}
                            color="inherit"
                            fullWidth
                            sx={{ backgroundColor: theme.palette.background.contrast }}
                          >
                            Add to Cart
                          </Button>
                        </Grid>
                        {/* <Grid item xs={6} sx={{ paddingTop: "0px" }}>
                          <Button
                            onClick={handleBuyNow}
                            color="inherit"
                            fullWidth
                            sx={{ backgroundColor: theme.palette.background.contrast }}
                          >
                            Buy Now
                          </Button>
                        </Grid> */}
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
                        onClick={() => handleOpenImageModal(`https://ayrujaipur.s3.amazonaws.com/${chart?.url}`)}
                        sx={{ columnGap: "2px", padding: "0px", boxShadow: "none", cursor: "pointer" }}
                      >
                        <CardMedia
                          component="img"
                          image={chart?.url ? `https://ayrujaipur.s3.amazonaws.com/${chart?.url}` : '/fallback_image_url'}
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
                style={{ width: "100%", height: "100%", padding: "15px 5px" }}
                // style={{ position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)', maxWidth: '20%', height: 'auto' }}
                mt={2}
              />
              <Divider sx={{ borderStyle: "dotted", mt: 0, mb: 2 }} />
              <FeatureAccordions product={product} />
            </CardContent >
          </Grid>
        </Grid>
      </Box>
      <Modal open={imageModalOpen} onClose={handleCloseImageModal}>
        <ImagePopup imageUrl={selectedImage} onClose={handleCloseImageModal} />
      </Modal>
      <Modal open={availabilityOpen} onClose={handleCloseAvailabilityModal}>
        <RequestAvailabilityModal product={product} open={availabilityOpen} handleClose={handleCloseAvailabilityModal} />
      </Modal>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      >
        <SnackbarContent style={{
          backgroundColor: "#fa6666",
          color: "white"
        }}
          message={snackbarMessage}
        />
      </Snackbar>

    </>
  );
};

export default ItemDetails;
