"use client";
import React, { useState, useEffect } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Button, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import api from '@/api';
import ImageUploader from './imageuploader';

const InventoryDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [inventory, setInventory] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (id) {
      fetchInventory();
    }
  }, [id]);

  const fetchInventory = async () => {
    try {
      const response = await api.get(`/inventory/${id}`);
      setInventory(response?.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const handleChange = (e, field) => {
    const { value } = e.target;
    setInventory((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    try {
      await api.put(`/inventory/${id}`, { [field]: inventory[field] });
      setEditMode((prev) => ({ ...prev, [field]: false }));
    } catch (error) {
      console.error("Error saving inventory:", error);
    }
  };

  const handleEditToggle = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageUpload = async (image) => {
    try {
      const formData = new FormData();
      formData.append('image', image);
      await api.post(`/inventory/${id}/images`, formData);
      fetchInventory();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      await api.delete(`/inventory/${id}/images/${imageId}`);
      fetchInventory();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  if (!inventory) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>Inventory Details</Typography>

      {/* Product Details */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Product Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {editMode?.productDetails ? (
            <>
              <TextField
                label="Product Name"
                value={inventory?.productName}
                onChange={(e) => handleChange(e, 'productName')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="SKU ID"
                value={inventory?.skuId}
                onChange={(e) => handleChange(e, 'skuId')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Quantity"
                value={inventory?.quantity}
                onChange={(e) => handleChange(e, 'quantity')}
                fullWidth
                margin="normal"
                type="number"
              />
              {/* Add other product details fields */}
              <Button variant="contained" color="primary" onClick={() => handleSave('productDetails')} sx={{ mt: 2 }}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Typography>Product Name: {inventory?.productName}</Typography>
              <Typography>SKU ID: {inventory?.skuId}</Typography>
              <Typography>Quantity: {inventory?.quantity}</Typography>
              {/* Add other product details fields */}
              <Button variant="outlined" color="primary" onClick={() => handleEditToggle('productDetails')} sx={{ mt: 2 }}>
                Edit
              </Button>
            </>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Statuses */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Statuses</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {editMode?.statuses ? (
            <>
              <TextField
                label="Product Status"
                value={inventory?.productstatus}
                onChange={(e) => handleChange(e, 'productstatus')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Status"
                value={inventory?.status}
                onChange={(e) => handleChange(e, 'status')}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={() => handleSave('statuses')} sx={{ mt: 2 }}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Typography>Product Status: {inventory?.productstatus}</Typography>
              <Typography>Status: {inventory?.status}</Typography>
              <Button variant="outlined" color="primary" onClick={() => handleEditToggle('statuses')} sx={{ mt: 2 }}>
                Edit
              </Button>
            </>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Upload Images and Videos */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Upload Images and Videos</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ImageUploader onUpload={handleImageUpload} />
          {inventory?.images && inventory?.images?.map((image) => (
            <Box key={image?.id} display="flex" alignItems="center" mt={2}>
              <img src={image.url} alt={image?.altText} width="100" />
              <IconButton onClick={() => handleImageDelete(image?.id)}>-</IconButton>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Pricing */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Pricing</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {editMode?.pricing ? (
            <>
              <TextField
                label="Selling Price"
                value={inventory?.sellingPrice}
                onChange={(e) => handleChange(e, 'sellingPrice')}
                fullWidth
                margin="normal"
                type="number"
              />
              <TextField
                label="Cost Price"
                value={inventory?.costPrice}
                onChange={(e) => handleChange(e, 'costPrice')}
                fullWidth
                margin="normal"
                type="number"
              />
              <TextField
                label="Discounted Price"
                value={inventory?.discountedPrice}
                onChange={(e) => handleChange(e, 'discountedPrice')}
                fullWidth
                margin="normal"
                type="number"
              />
              {/* Add other pricing fields */}
              <Button variant="contained" color="primary" onClick={() => handleSave('pricing')} sx={{ mt: 2 }}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Typography>Selling Price: ${inventory?.sellingPrice}</Typography>
              <Typography>Cost Price: ${inventory?.costPrice}</Typography>
              <Typography>Discounted Price: ${inventory?.discountedPrice}</Typography>
              {/* Add other pricing fields */}
              <Button variant="outlined" color="primary" onClick={() => handleEditToggle('pricing')} sx={{ mt: 2 }}>
                Edit
              </Button>
            </>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Extra Details */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Extra Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {editMode?.extraDetails ? (
            <>
              <TextField
                label="Style"
                value={inventory?.style}
                onChange={(e) => handleChange(e, 'style')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Pattern"
                value={inventory?.pattern}
                onChange={(e) => handleChange(e, 'pattern')}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Fabric"
                value={inventory?.fabric}
                onChange={(e) => handleChange(e, 'fabric')}
                fullWidth
                margin="normal"
              />
              {/* Add other extra details fields */}
              <Button variant="contained" color="primary" onClick={() => handleSave('extraDetails')} sx={{ mt: 2 }}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Typography>Style: {inventory?.style}</Typography>
              <Typography>Pattern: {inventory?.pattern}</Typography>
              <Typography>Fabric: {inventory?.fabric}</Typography>
              {/* Add other extra details fields */}
              <Button variant="outlined" color="primary" onClick={() => handleEditToggle('extraDetails')} sx={{ mt: 2 }}>
                Edit
              </Button>
            </>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Size Type */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Size Type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Implement size type fields */}
          <Typography>Size Type details go here.</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Size Chart */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Size Chart</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Implement size chart fields */}
          <Typography>Size Chart details go here.</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default InventoryDetailsPage;
