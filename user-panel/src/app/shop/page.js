"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { Grid, Select, MenuItem, FormControl, InputLabel, Box, Paper, Typography, useTheme, Button, Drawer, TextField, IconButton, Divider, FormControlLabel, Checkbox, Slider, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import api from '../../../api';
import InventoryItem from '@/components/Inventory/InventoryItem';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import WebpImage from '../../../public/images/blog1.webp';
import CloseIcon from '@mui/icons-material/Close';

const CustomBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  '& > *': {
    width: '45%',
  },
}));

const ShopPageContent = () => {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [availability, setAvailability] = useState('');
  const [outOfStock, setOutOfStock] = useState(false);
  const theme = useTheme();

  const handlePriceRangeChange = (event, newValue) => {
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  const handleMinPriceChange = (event) => {
    const value = Number(event.target.value);
    if (value >= 0 && value <= maxPrice) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (event) => {
    const value = Number(event.target.value);
    if (value >= minPrice && value <= 10000) {
      setMaxPrice(value);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryId || subcategoryId) {
      setSelectedCategory(categoryId);
      setSelectedSubcategory(subcategoryId && subcategoryId)
      fetchCategories();
    } else {
      fetchAllInventory();
    }
  }, [categoryId, subcategoryId]);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      searchInventory();
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchSort();
  }, [sortBy, sortOrder]);

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

  //-------------------------------sorting and searching----------------------------

  const fetchSort = () => {
    let url = '/inventory/filter';
    const params = {
      sortBy,
      sortOrder,
      categoryId: selectedCategory || '',
      subCategoryId: selectedSubcategory || ''
    };

    api.get(url, { params })
      .then(response => {
        setInventory(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      });
  };

  const handleFilterChange = () => {
    fetchSort();
  };


  const handleSortChange = (event) => {
    const [newSortBy, newSortOrder] = event.target.value.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };
  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setMinPrice(0);
    setMaxPrice(10000);
    setAvailability('');
    setOutOfStock(false);
    fetchAllInventory();
    handleDrawerClose();
  };


  const searchInventory = () => {
    let url = '/inventory/search';
    const params = { searchQuery };
    if (selectedCategory) {
      params.categoryId = selectedCategory;
    }
    if (selectedSubcategory) {
      params.subCategoryId = selectedSubcategory;
    }

    api.get(url, { params })
      .then(response => {
        setInventory(response.data.data);
      })
      .catch(error => {
        console.error('Error searching inventory:', error);
      });
    // api.get(url, { params })
    //   .then(response => {
    //     setInventory(response.data.data);
    //   })
    //   .catch(error => {
    //     console.error('Error searching inventory:', error);
    //   });
  };

  const handleDrawerOpen = (content) => {
    setDrawerContent(content);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
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
      <Grid container p={1} spacing={1}>
        <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between" mb={1} mt={1}>
          <TextField
            fullWidth
            label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={searchInventory}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
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

        {/* {selectedCategory && ( */}
        <Grid item xs={6} sm={6} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select Subcategory</InputLabel>
            <Select
              value={selectedSubcategory}
              onChange={(e) => handleSubcategoryChange(e.target.value)}
              disabled={!selectedCategory}
            >
              <MenuItem value="">Select Subcategory</MenuItem>
              {subcategories.map(subcategory => (
                <MenuItem key={subcategory.id} value={subcategory.id}>{subcategory.subcategoryName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid >
        {/* )} */}
      </Grid >
      <Grid container spacing={3} className="shop-page" style={{ padding: " 3% 2%" }}>
        <Grid container spacing={1} item xs={12}>
          {inventory.map(item => (
            item?.productstatus === "PUBLISHED" && (
              <Grid key={item.id} item xs={6} sm={6} md={4} lg={2.4} xl={2}>
                <InventoryItem item={item} />
              </Grid>
            )
          ))}
        </Grid>
      </Grid>

      <Box sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        // backgroundColor: "#F0F0F0",
        backgroundColor: theme.palette.background.contrast,
        color: theme.palette.primary.contrastText,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        padding: '10px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => handleDrawerOpen('filter')}
          sx={{
            color: theme.palette.primary.contrastText,
          }}
        >
          Filter
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => handleDrawerOpen('sort')}
          sx={{
            color: theme.palette.primary.contrastText,
          }}
        >
          Sort By
        </Button>
      </Box>

      <Drawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <Box sx={{ padding: '40px 20px' }}>
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              color: theme.palette.text.primary,
            }}
          >
            <CloseIcon />
          </IconButton>
          {drawerContent === 'sort' && (
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onChange={handleSortChange}
              >
                <MenuItem value="sellingPrice-asc">Price low to high</MenuItem>
                <MenuItem value="sellingPrice-desc">Price high to low</MenuItem>
                <MenuItem value="updatedAt-asc">Date old to new</MenuItem>
                <MenuItem value="updatedAt-desc">Date new to old</MenuItem>
              </Select>
            </FormControl>
          )}
          {drawerContent === 'filter' && (
            <>
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  value={selectedSubcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                >
                  <MenuItem value="">All Subcategories</MenuItem>
                  {subcategories.map(subcategory => (
                    <MenuItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.subcategoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ marginTop: 2, padding: 1 }}>
                <Typography>Price Range</Typography>
                <Slider
                  value={[minPrice, maxPrice]}
                  onChange={handlePriceRangeChange}
                  aria-labelledby="custom-slider"
                  valueLabelDisplay="off"
                  min={0}
                  max={10000}
                />
                <CustomBox>
                  <TextField
                    label="Min Price"
                    type="number"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    InputProps={{
                      inputProps: { min: 0, max: maxPrice }
                    }}
                  />
                  <TextField
                    label="Max Price"
                    type="number"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    InputProps={{
                      inputProps: { min: minPrice, max: 10000 }
                    }}
                  />
                </CustomBox>
              </FormControl>
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel>Availability</InputLabel>
                <Select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <MenuItem value="">All Availability</MenuItem>
                  <MenuItem value="true">Available</MenuItem>
                  <MenuItem value="false">Not Available</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={outOfStock}
                      onChange={(e) => setOutOfStock(e.target.checked)}
                    />
                  }
                  label="Out of Stock"
                />
              </FormControl>

              <Button
                onClick={handleResetFilters}
                fullWidth
                variant="outlined"
                sx={{ marginTop: 2 }}
              >
                Reset Filters
              </Button>
              <Button onClick={handleFilterChange} fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }}>
                Apply Filters
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};


const ShopPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPageContent />
    </Suspense>
  );
};

export default ShopPage;
