import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Typography, MenuItem, Paper, FormControl, InputLabel, Select } from '@mui/material';
import api from '../../../api';
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
        const response = await api.get('/categories');
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
    let { name, value } = e.target;
    if (name == "sellingPrice" || name == "quantity") {
      value = parseInt(value);
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;

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
    // <Modal open={open} onClose={handleClose}>

    <Paper
      variant="outlined"
      sx={{ padding: 3, margin: "auto", mt: 4, width: 400, position: "relative" }}
    >
      <Typography variant="h6" mb={2} sx={{ fontWeight: 'bold' }}>
        Create New Inventory
      </Typography>
      <Box component="form" sx={{ mt: 2 }} noValidate autoComplete="off">

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
          value={parseFloat(formData.sellingPrice)}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        {/* <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={formData.categoryId}
            onChange={handleChange}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
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
        {/* <TextField
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
        </TextField> */}
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
    </Paper>
    // </Modal>
  );
};

export default CreateInventoryModal;
