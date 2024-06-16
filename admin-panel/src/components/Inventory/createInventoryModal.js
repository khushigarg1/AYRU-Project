import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Typography, MenuItem } from '@mui/material';
import api from '@/api';
import Cookies from 'js-cookie';

const initialFormData = {
  productName: '',
  skuId: '',
  quantity: 0,
  sellingPrice: 0.0,
  categoryId: '',
  subCategoryId: ''
};

const CreateInventoryModal = ({ open, handleClose, refresh }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories'); // Adjust the endpoint accordingly
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      const selectedCategory = categories.find(cat => cat.id === formData.categoryId);
      if (selectedCategory) {
        setSubcategories(selectedCategory.subcategories);
      }
    } else {
      setSubcategories([]);
    }
  }, [formData.categoryId, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = Cookies.get("token");
    api.defaults.headers.Authorization = `Bearer ${token}`;

    try {
      await api.post('/inventory', formData);
      handleClose();
      refresh();
    } catch (error) {
      console.error("Error creating inventory item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          outline: 'none',
        }}
      >
        <Typography variant="h6" mb={2} sx={{ fontWeight: 'bold' }}>
          Create New Inventory
        </Typography>
        <TextField
          label="Product Name"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="SKU ID"
          name="skuId"
          value={formData.skuId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Selling Price"
          name="sellingPrice"
          type="number"
          value={formData.sellingPrice}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          select
          label="Category"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.categoryName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Subcategory"
          name="subCategoryId"
          value={formData.subCategoryId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          disabled={!formData.categoryId}
        >
          {subcategories.map((subcategory) => (
            <MenuItem key={subcategory.id} value={subcategory.id}>
              {subcategory.subcategoryName}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateInventoryModal;
