"use client";
import React, { useState, useEffect } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, Button, IconButton, Modal, Grid, FormControlLabel, Switch, Select, MenuItem, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import api from '../../../../api';
import ImageUploader from '../../../components/Inventory/imageuploader';
import ImagePopup from '../../../modals/imagepopup';
import VideoPopup from "../../../modals/videpopup"
import ProductDetailsForm from '../../../components/Inventory/ProductDetailsform';
import PricingDetailsForm from '../../../components/Inventory/PricingDetails';
import ProductInformation from '../../../components/Inventory/ProductInformation';
import AdditionalInfo from '../../../components/Inventory/AdditionalInfo';
import SizeChartComponent from '../../../components/Inventory/sizeType';
import GroupDetails from '../../../components/Inventory/Details';
import { CloudUpload, DeleteForever, Padding } from '@mui/icons-material';
import { GridDeleteIcon } from '@mui/x-data-grid';

const HomePage = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const [inventory, setInventory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [Editadditional, setEditAdditional] = useState(false);
  const [sizeChartImage, setSizeChartImage] = useState(null);

  useEffect(() => {
    if (id) {
      fetchInventory();
    }
  }, [id]);

  const fetchInventory = async () => {
    try {
      const response = await api.get(`/inventory/admin/${id}`);
      setInventory(response?.data?.data);
      setSizeChartImage(response?.data?.data?.SizeChartMedia[0]?.url || null);
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
    const filesArray = Array.isArray(files) ? files : [files];
    const formData = new FormData();

    if (filesArray.length === 0) {
      console.error("No files to upload");
      return;
    }

    filesArray.forEach((file, index) => {
      formData.append('images', file);
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
    const formattedInventory = await formatInventoryData(inventory);
    try {
      await api.put(`/inventory/${id}`, { ...formattedInventory, ...updatedInventory });
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

  const formatInventoryData = (inventory) => {
    // console.log("data", inventory);

    return {
      ...inventory,
      colorIds: inventory?.ColorVariations?.map((cv) => cv?.colorId) || [],
      flatIds: inventory?.InventoryFlat?.map((fv) => ({ ...fv, id: fv.flatId })) || [],
      customFittedIds: inventory?.customFittedInventory?.map((cfv) => ({ ...cfv, id: cfv.customFittedId })) || [],
      fittedIds: inventory?.InventoryFitted?.map((fv) => ({ ...fv, id: fv.fittedId })) || [],
      relatedInventoriesIds: inventory?.relatedInventories?.map(inv => inv.id) || [],
      subCategoryIds: inventory?.InventorySubcategory?.map(inv => inv?.subcategoryid) || []
    };
  };

  const updateInventory = async (id, updates, inventory) => {
    try {
      const formattedInventory = await formatInventoryData(inventory);
      await api.put(`/inventory/${id}`, { ...formattedInventory, ...updates });
      fetchInventory();
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };
  const handleToggleAvailability = (event) => {
    updateInventory(id, { availability: event.target.checked }, inventory);
  };

  const handleToggleExtraOptionOutOfStock = (event) => {
    updateInventory(id, { extraOptionOutOfStock: event.target.checked }, inventory);
  };
  const handleToggleSale = (event) => {
    console.log(event.target.checked);
    updateInventory(id, { sale: event.target.checked }, inventory);
  };

  const handleProductStatusChange = (event) => {
    updateInventory(id, { productstatus: event.target.value }, inventory);
  };

  //-----------------sizechart image

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (files) {
      handleSizeChartImageUpload(files[0]);
    }

  };
  const handleSizeChartImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('inventoryId', id);

    try {
      await api.post(`/inventory/chart/upload/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchInventory();
    } catch (error) {
      console.error('Error uploading size chart image:', error);
    }
  };
  const handleSizeChartImageDelete = async () => {
    try {
      await api.delete(`/inventory/chart/${id}`);
      fetchInventory();
    } catch (error) {
      console.error('Error deleting size chart image:', error);
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
            <Typography>Upload Size Chart Image</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" flexDirection="column" alignItems="center">
              {sizeChartImage ? (
                <Box position="relative">
                  <img
                    src={`https://ayrujaipur.s3.amazonaws.com/${sizeChartImage}`}
                    alt="Size Chart Image"
                    width={200}
                    height={200}
                    style={{ borderRadius: '8px', cursor: 'pointer' }}
                    onClick={() => handleOpenImageModal(`https://ayrujaipur.s3.amazonaws.com/${sizeChartImage}`)}
                  />
                  <IconButton
                    onClick={handleSizeChartImageDelete}
                    sx={{
                      width: '10px',
                      height: '10px',
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
              ) : (
                // <ImageUploader onUpload={handleSizeChartImageUpload} />

                <>
                  < Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {/* {formDataVal.image ? formDataVal.image.name : "Upload Image"} */}
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      hidden
                      onChange={handleChange}
                    />
                  </Button>
                </>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

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
                        src={`https://ayrujaipur.s3.amazonaws.com/${media.url}`}
                        alt="Product Image"
                        width={100}
                        height={100}
                        style={{ cursor: 'pointer', borderRadius: '8px' }}
                        onClick={() => handleOpenImageModal(`https://ayrujaipur.s3.amazonaws.com/${media.url}`)}
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
                      {/* {inventory.customFittedInventory?.map((custom) => ( */}
                      <>
                        <Typography >{inventory.customFittedInventory[0]?.sellingPrice}</Typography>
                        <Typography >{inventory.customFittedInventory[0]?.costPrice}</Typography>
                        <Typography >{inventory.customFittedInventory[0]?.discountedPrice}</Typography>
                      </>
                      {/* ))} */}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">Fitted:</Typography>
                      {inventory.InventoryFitted?.map((fitted, index) => (
                        <div key={index}>
                          <Typography>{fitted?.Fitted?.name}</Typography>
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
              <Grid item xs={12}>
                <Typography variant="h6">Sale Item</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={inventory.sale || false}
                      onChange={handleToggleSale}
                      color="primary"
                    />
                  }
                  label={inventory.sale ? 'sale item' : 'not a sale item'}
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
      </Box >
    </>
  );
};

export default HomePage;
