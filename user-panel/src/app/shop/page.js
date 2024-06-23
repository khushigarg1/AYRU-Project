"use client"
import React, { useState, useEffect } from 'react';
import { Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import api from '../../../api';
import InventoryItem from '@/components/Inventory/InventoryItem';
import { useSearchParams } from 'next/navigation';

const ShopPage = () => {

  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoryId');
  const subcategoryId = searchParams.get('subcategoryId');
  const search = searchParams.get('search')
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    if (subcategoryId) {
      setSelectedSubcategory(subcategoryId);
    }
    fetchCategories();

  }, [categoryId, subcategoryId]);

  useEffect(() => {
    fetchAllInventory();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);

      if (categoryId) {
        const selectedCategoryData = response.data.data.find(cat => cat.id === parseInt(categoryId));
        if (selectedCategoryData) {
          setSubcategories(selectedCategoryData.subcategories);
        }
      }
      fetchInventory(categoryId, subcategoryId)
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);

    if (categoryId === '') {
      fetchAllInventory();
    } else {
      const selectedCategoryData = categories.find(cat => cat.id === parseInt(categoryId));
      if (selectedCategoryData) {
        setSubcategories(selectedCategoryData.subcategories);
      }

      fetchInventory(categoryId, selectedSubcategory);
    }
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    fetchInventory(selectedCategory, subcategoryId);
  };

  const fetchInventory = (categoryId, subcategoryId) => {
    let url = '/inventory/category';

    const params = {};
    if (categoryId) {
      params.categoryId = categoryId;
    }
    if (subcategoryId) {
      params.subCategoryId = subcategoryId;
    }

    api.get(url, { params })
      .then(response => {
        console.log(response.data.data);
        setInventory(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      });
  };

  const fetchAllInventory = () => {

    api.get('/inventory')
      .then(response => {
        console.log(response.data.data);
        setInventory(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      });
  };

  return (
    <Grid container spacing={3} className="shop-page" style={{ padding: " 3% 2%" }}>
      <Grid item xs={12}>
        <h1>Shop Page</h1>
      </Grid>

      {/* Categories Dropdown */}
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth>
          <InputLabel>Select Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>{category.categoryName}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Subcategories Dropdown */}
      {selectedCategory && (
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Select Subcategory</InputLabel>
            <Select
              value={selectedSubcategory}
              onChange={(e) => handleSubcategoryChange(e.target.value)}
            >
              <MenuItem value="">Select Subcategory</MenuItem>
              {subcategories.map(subcategory => (
                <MenuItem key={subcategory.id} value={subcategory.id}>{subcategory.subcategoryName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}

      {/* Inventory Listing */}
      <Grid container spacing={2} item xs={12}>
        {inventory.map(item => (
          <Grid key={item.id} item xs={6} sm={4} md={4} lg={3} xl={2}>
            <InventoryItem item={item} />
          </Grid>
        ))}
      </Grid>

    </Grid>
  );
};

export default ShopPage;

