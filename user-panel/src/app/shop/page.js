"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid, Select, MenuItem, FormControl, InputLabel, Box, Paper, Typography, useTheme } from '@mui/material';
import api from '../../../api';
import InventoryItem from '@/components/Inventory/InventoryItem';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import WebpImage from '../../../public/images/blog1.webp';

const ShopPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const subcategoryId = searchParams.get('subcategoryId');
  const search = searchParams.get('search');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryId || subcategoryId) {
      fetchCategories();
    } else {
      fetchAllInventory();
    }
  }, [categoryId, subcategoryId]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
      if (categoryId) {
        const selectedCategoryData = response.data.data.find(cat => cat.id === parseInt(categoryId));
        if (selectedCategoryData) {
          setSubcategories(selectedCategoryData.subcategories);
          setCategoryName(selectedCategoryData.categoryName);
        }
      }
      if (categoryId || subcategoryId) {
        fetchInventory(categoryId, subcategoryId);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');

    if (categoryId === '') {
      setCategoryName('All Categories');
      fetchAllInventory();
    } else {
      const selectedCategoryData = categories.find(cat => cat.id === parseInt(categoryId));
      if (selectedCategoryData) {
        setCategoryName(selectedCategoryData.categoryName);
        setSubcategories(selectedCategoryData.subcategories);
      }
      fetchInventory(categoryId, null);
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
        setInventory(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      });
  };

  const fetchAllInventory = () => {
    setCategoryName('All Categories');
    api.get('/inventory')
      .then(response => {
        setInventory(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      });
  };

  return (
    <>
      <Box sx={{
        display: 'flex', paddingX: "50px", justifyContent: 'center',
        alignItems: 'center', marginTop: 1, position: 'relative', width: '100%',
        height: '130px', backgroundColor: theme.palette.background.paper
      }}>
        <Image src={WebpImage} alt="Left Image" width={100} height={100} style={{ position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)', maxWidth: '20%', height: 'auto' }} />
        <Paper sx={{ padding: 2, textAlign: 'center', maxWidth: '800px', boxShadow: "none", fontFamily: theme.palette.typography.fontFamily }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontFamily: 'Augustine, serif',
              fontWeight: 'bold'
            }}
          >
            {categoryName}
          </Typography>
        </Paper>
        <Image src={WebpImage} alt="Right Image" width={100} height={100} style={{ position: 'absolute', right: '-8px', top: '50%', transform: 'translateY(-50%)', maxWidth: '20%', height: 'auto' }} />
      </Box>

      <Grid container spacing={3} className="shop-page" style={{ padding: " 3% 2%" }}>
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

        <Grid container spacing={2} item xs={12}>
          {inventory.map(item => (
            <Grid key={item.id} item xs={6} sm={4} md={4} lg={3} xl={2}>
              <InventoryItem item={item} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default ShopPage;
