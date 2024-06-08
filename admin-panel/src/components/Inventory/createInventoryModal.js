"use client"
import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import api from '@/api';

const initialFormData = {
  productName: '',
  skuId: '',
  quantity: 0,
  sellingPrice: 0.0,
  // Add other main information fields as needed
};

const CreateInventoryModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    await api.post('/inventories', formData);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" mb={2}>Create New Inventory</Typography>
        <TextField
          label="Product Name"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="SKU ID"
          name="skuId"
          value={formData.skuId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Selling Price"
          name="sellingPrice"
          value={formData.sellingPrice}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {/* Add other fields as needed */}
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
          Create
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateInventoryModal;
