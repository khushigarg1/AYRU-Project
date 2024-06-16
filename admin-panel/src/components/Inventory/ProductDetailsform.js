"use client"
import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Grid, Select, MenuItem } from '@mui/material';
import api from '@/api';

const ProductDetailsForm = ({ inventory, onSave, onCancel }) => {
  const [editedInventory, setEditedInventory] = useState({ ...inventory });
  const [editMode, setEditMode] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    quantity: '',
    minQuantity: '',
    maxQuantity: '',
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

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
    if (editedInventory.categoryId) {
      const selectedCategory = categories.find(cat => cat.id === editedInventory.categoryId);
      if (selectedCategory) {
        setSubcategories(selectedCategory.subcategories);
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  }, [editedInventory.categoryId, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity' || name === 'minQuantity' || name === 'maxQuantity') {
      if (!(/^\d+$/.test(value))) {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: 'Please enter a valid numeric value.',
        }));
      } else {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }

    setEditedInventory(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedInventory);
    setEditMode(false);
  };
  const handleCancel = () => {
    setEditedInventory({ ...inventory });
    setEditMode(false);
    setFieldErrors({
      quantity: '',
      minQuantity: '',
      maxQuantity: '',
    });
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setFieldErrors({
      quantity: '',
      minQuantity: '',
      maxQuantity: '',
    });
  };

  const getCategoryNameById = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.categoryName : '';
  };

  const getSubcategoryNameById = (subCategoryId) => {
    const subcategory = subcategories.find(subcat => subcat.id === subCategoryId);
    return subcategory ? subcategory.subcategoryName : '';
  };

  return (
    <Grid container spacing={2}>
      {editMode ? (
        <>
          <Grid item xs={12}>
            <TextField
              label="Product Name"
              name="productName"
              value={editedInventory.productName}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="SKU ID"
              name="skuId"
              value={editedInventory.skuId}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Quantity"
              name="quantity"
              value={editedInventory.quantity}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              type="text"
              error={fieldErrors.quantity !== ''}
              helperText={fieldErrors.quantity}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Min Quantity"
              name="minQuantity"
              value={editedInventory.minQuantity}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              type="text"
              error={fieldErrors.minQuantity !== ''}
              helperText={fieldErrors.minQuantity}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Max Quantity"
              name="maxQuantity"
              value={editedInventory.maxQuantity}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              type="text"
              error={fieldErrors.maxQuantity !== ''}
              helperText={fieldErrors.maxQuantity}
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              label="Category"
              name="categoryId"
              value={editedInventory.categoryId}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
            >
              <MenuItem value="">Select Category</MenuItem>
              {categories?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Select
              label="Subcategory"
              name="subCategoryId"
              value={editedInventory.subCategoryId}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={!editedInventory.categoryId}
            >
              <MenuItem value="">Select Subcategory</MenuItem>
              {subcategories?.map((subcategory) => (
                <MenuItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.subcategoryName}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12}>
            <Typography><strong>Product Name:</strong> {inventory.productName}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>SKU ID:</strong> {inventory.skuId}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Quantity:</strong> {inventory.quantity}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Min Quantity:</strong> {inventory.minQuantity}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Max Quantity:</strong> {inventory.maxQuantity}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Category:</strong> {getCategoryNameById(inventory.categoryId)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Subcategory:</strong> {getSubcategoryNameById(inventory.subCategoryId)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleEditToggle}>
              Edit
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default ProductDetailsForm;
