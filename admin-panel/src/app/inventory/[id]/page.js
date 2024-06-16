"use client";
import React, { useState, useEffect } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, Button, IconButton, Modal, Grid, FormControlLabel, Switch, Select, MenuItem, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import api from '@/api';
import ImageUploader from '@/src/components/Inventory/imageuploader';
import ImagePopup from '@/src/modals/imagepopup';
import VideoPopup from '@/src/modals/videpopup';
import ProductDetailsForm from '@/src/components/Inventory/ProductDetailsform';
import PricingDetailsForm from '@/src/components/Inventory/PricingDetails';
import ProductInformation from '@/src/components/Inventory/ProductInformation';
import AdditionalInfo from '@/src/components/Inventory/AdditionalInfo';
import SizeChartComponent from '@/src/components/Inventory/sizeType';
import GroupDetails from '@/src/components/Inventory/Details';
import { Padding } from '@mui/icons-material';

const HomePage = ({ params }) => {
  const router = useRouter();
  console.log("router", router, params);
  const { id } = params;
  const [inventory, setInventory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [Editadditional, setEditAdditional] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInventory();
    }
  }, [id]);

  const fetchInventory = async () => {
    try {
      const response = await api.get(`/inventory/${id}`);
      console.log(response.data);
      setInventory(response?.data?.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const handleOpenVideoModal = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
    setVideoModalOpen(true);
  };

  const handleOpenImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  const handleImageUpload = async (files) => {
    console.log("files", files);
    const filesArray = Array.isArray(files) ? files : [files];
    const formData = new FormData();

    if (filesArray.length === 0) {
      console.error("No files to upload");
      return;
    }

    filesArray.forEach((file, index) => {
      formData.append('images', file);
      console.log(`Appending file ${index}:`, file);
    });

    formData.append('inventoryId', id);

    try {
      await api.post(`/inventory/upload/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchInventory();
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      await api.delete(`/inventory/media/${imageId}`);
      fetchInventory();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleSaveProductDetails = async (updatedInventory) => {
    try {
      await api.put(`/inventory/${id}`, updatedInventory);
      fetchInventory();
    } catch (error) {
      console.error("Error saving inventory:", error);
    }
  };

  const handleCancelProductDetails = () => {
    fetchInventory();
  };

  if (!inventory) {
    return <Typography>Loading...</Typography>;
  }


  const handleEditToggle = () => {
    setEditAdditional(!Editadditional);
  };



  const handleToggleAvailability = async (event) => {
    try {
      await api.put(`/inventory/${id}`, { availability: event.target.checked });
      fetchInventory();
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const handleToggleExtraOptionOutOfStock = async (event) => {
    try {
      await api.put(`/inventory/${id}`, { extraOptionOutOfStock: event.target.checked });
      fetchInventory();
    } catch (error) {
      console.error("Error updating extra option out of stock:", error);
    }
  };

  const handleProductStatusChange = async (event) => {
    try {
      await api.put(`/inventory/${id}`, { productstatus: event.target.value });
      fetchInventory();
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  return (
    <>
      <Paper style={{ padding: "10px" }} p={7}>
        <GroupDetails details={inventory} />
      </Paper>
      <Box mt={2} p={0}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Upload Images and Videos</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" flexDirection="column" width="100%">
              <ImageUploader onUpload={handleImageUpload} />
              <Box mt={2} display="flex" flexWrap="wrap" gap={3}>
                {inventory.Media && inventory.Media.map((media) => (
                  <Box key={media.id} display="flex" flexDirection="column" alignItems="center" sx={{ position: 'relative', width: 100 }}>
                    {media.type === 'video' ? (
                      <Button
                        color="primary"
                        onClick={() => handleOpenVideoModal(media.url)}
                        variant="contained"
                        sx={{ mb: 1 }}
                      >
                        Play Video
                      </Button>
                    ) : (
                      <img
                        src={`${api.defaults.baseURL}image/${media.url}`}
                        alt="Product Image"
                        width={100}
                        height={100}
                        style={{ cursor: 'pointer', borderRadius: '8px' }}
                        onClick={() => handleOpenImageModal(`${api.defaults.baseURL}image/${media.url}`)}
                      />
                    )}
                    <IconButton
                      onClick={() => handleImageDelete(media.id)}
                      sx={{
                        width: '5px',
                        height: '5px',
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        backgroundColor: 'red',
                        borderRadius: '50%',
                        '&:hover': {
                          backgroundColor: 'red',
                          color: 'white',
                        },
                      }}
                    >
                      -
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Product Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ProductDetailsForm
              inventory={inventory}
              onSave={handleSaveProductDetails}
              onCancel={handleCancelProductDetails}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Pricing Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PricingDetailsForm
              inventory={inventory}
              onSave={handleSaveProductDetails}
              onCancel={handleCancelProductDetails}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Product Complete Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ProductInformation
              inventory={inventory}
              onSave={handleSaveProductDetails}
              onCancel={handleCancelProductDetails}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Size Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {Editadditional ? (
              <SizeChartComponent
                inventory={inventory}
                onSave={handleSaveProductDetails}
                onCancel={handleCancelProductDetails}
                Editadditional={handleEditToggle}
              />) :
              (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Colors:</Typography>
                      {inventory.ColorVariations?.map((color) => (
                        <Typography key={color}>{color?.Color?.name}</Typography>
                      ))}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">Flats:</Typography>
                      {inventory.InventoryFlat?.map((flat) => (
                        <Typography key={flat}>{flat?.Flat?.name}</Typography>
                      ))}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">Custom Fitted:</Typography>
                      {inventory.customFittedInventory?.map((custom) => (
                        <Typography key={custom}>{custom?.customFitted?.name}</Typography>
                      ))}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">Fitted:</Typography>
                      {inventory.InventoryFitted?.map((fitted, index) => (
                        <div key={index}>
                          <Typography>{fitted?.Fitted?.name}</Typography>
                          {fitted?.fittedDimensions?.map((dimension, dimindex) => (
                            <Typography ml={8} key={dimindex} variant="body2">
                              {dimension.dimensions}
                            </Typography>
                          ))}
                        </div>
                      ))}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">Size Charts:</Typography>
                      {inventory.ProductInventory?.map((sizechart, index) => (
                        <div key={index}>
                          <Typography variant="subtitle1">
                            {sizechart?.product?.name}
                          </Typography>
                          {sizechart?.product?.sizes?.map((size, sizeIndex) => (
                            <Typography ml={8} key={sizeIndex} variant="body2">
                              {`${size.name}:- Width: ${size.width}, Height: ${size.height}`}
                            </Typography>
                          ))}
                        </div>
                      ))}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">Related Inventories:</Typography>
                      {inventory.relatedInventories?.map((inventory, index) => (
                        <Typography key={index}>{`${inventory?.id} ${inventory?.productName}`}</Typography>
                      ))}
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" color="primary" onClick={handleEditToggle}>
                        Edit
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )
            }
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Additional Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AdditionalInfo
              inventory={inventory}
              onSave={handleSaveProductDetails}
              onCancel={handleCancelProductDetails}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Availability</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={inventory.availability || false}
                      onChange={handleToggleAvailability}
                      color="primary"
                    />
                  }
                  label={inventory.availability ? 'Available' : 'Not Available'}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Product Status</Typography>
                <Select
                  value={inventory.productstatus || ''}
                  onChange={handleProductStatusChange}
                  fullWidth
                >
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="PUBLISHED">Published</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Extra Option Out of Stock</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={inventory.extraOptionOutOfStock || false}
                      onChange={handleToggleExtraOptionOutOfStock}
                      color="primary"
                    />
                  }
                  label={inventory.extraOptionOutOfStock ? 'Out of Stock' : 'Available'}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Modal open={imageModalOpen} onClose={handleCloseImageModal}>
          <ImagePopup imageUrl={selectedImage} onClose={handleCloseImageModal} />
        </Modal>
        <Modal open={videoModalOpen} onClose={() => setVideoModalOpen(false)}>
          <Box>
            <VideoPopup open={videoModalOpen} videoUrl={selectedVideoUrl} onClose={() => setVideoModalOpen(false)} />
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default HomePage;
