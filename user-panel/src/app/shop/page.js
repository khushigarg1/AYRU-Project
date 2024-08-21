"use client";
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Grid, Select, MenuItem, FormControl, InputLabel, Box, Paper, Typography, useTheme, Button, Drawer, TextField, IconButton, Divider, Slider, FormControlLabel, Checkbox, styled, CircularProgress, Autocomplete, Popper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import api from '../../../api';
import InventoryItem from '@/components/Inventory/InventoryItem';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import WebpImage from '../../../public/images/blog1.webp';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '@/contexts/auth';
import Cookies from 'js-cookie';
const CustomSelect = styled(Select)(({ theme }) => ({
  fontFamily: theme.palette.typography.fontFamily,
  '& .MuiSelect-select': {
    fontFamily: theme.palette.typography.fontFamily,
  },
}));
const CustomBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  '& > *': {
    width: '49%',
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
  const [extraOptionOutOfStock, setextraOptionOutOfStock] = useState('');
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState({});
  const { user, setWishlistCount } = useAuth();
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      setLoading(true);
      try {
        if (token) {
          const response = await api.get(`/wishlist/user/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const wishlistItemsData = response.data.data;
          setWishlistCount(wishlistItemsData.length);
          const wishlistMap = wishlistItemsData.reduce((acc, wishlistItem) => {
            acc[wishlistItem?.inventoryId] = wishlistItem?.id;
            return acc;
          }, {});
          setWishlistItems(wishlistMap);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setLoading(false);
      }
    };

    if (user && user.id && token) {
      fetchWishlistStatus();
    }
  }, [token, user, setWishlistCount]);


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
    if (categoryId || subcategoryId) {
      setSelectedCategory(categoryId);
      setSelectedSubcategory(subcategoryId && subcategoryId)
      fetchCategories();
    } else {
      setSelectedCategory('');
      setSelectedSubcategory(null);
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
      setLoading(true);
      const response = await api.get('/categories/visible');
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error); setLoading(false);

    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');

    if (categoryId === 'All') {
      setCategoryName('All Categories');
      setSubcategories('');
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
    if (subcategoryId === 'All') {
      setSelectedSubcategory('');
      fetchInventory(selectedCategory, '');
    } else {
      setSelectedSubcategory(subcategoryId);
      fetchInventory(selectedCategory, subcategoryId);
    }
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
    setLoading(true);

    api.get(url, { params })
      .then(response => {
        setInventory(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      }).finally(() => {
        setLoading(false);
      })
  };

  const fetchAllInventory = () => {
    setCategoryName('All Categories');
    setLoading(true);

    api.get('/inventory')
      .then(response => {
        setInventory(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      }).finally(() => {
        setLoading(false);
      })
  };

  //-------------------------------sorting and searching----------------------------

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setMinPrice(0);
    setMaxPrice(10000);
    setAvailability('');
    setextraOptionOutOfStock('');
    fetchAllInventory();
    handleDrawerClose();
  };

  const handleFilterChange = () => {
    fetchSort();
  };


  const fetchSort = () => {
    let url = '/inventory/filter';
    const params = {
      sortBy,
      sortOrder,
      categoryId: selectedCategory,
      subCategoryId: selectedSubcategory,
      availability,
      extraOptionOutOfStock,
      minPrice,
      maxPrice
    };
    setLoading(true);

    api.get(url, { params })
      .then(response => {
        setInventory(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      }).finally(() => {
        setLoading(false);
      })

    handleDrawerClose();
  };

  const handleSortChange = (event) => {
    const [newSortBy, newSortOrder] = event.target.value.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    console.log(sortBy, sortOrder);
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
      })
  };

  const handleDrawerOpen = (content) => {
    setDrawerContent(content);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  const handleOutOfStockChange = (event) => {
    setextraOptionOutOfStock(event.target.value || '');
  };

  const handleAvailabilityChange = (event) => {
    setAvailability(event.target.value || '');
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

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
            <CustomSelect
              value={selectedCategory}
              closeMenuOnScroll={true}
              label="Select Category"
              onChange={(e) => handleCategoryChange(e.target.value)}
              sx={{
                fontFamily: theme.palette.typography.fontFamily,
                '& .MuiSelect-root': {
                  padding: '10px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.background.contrast,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.background.contrast,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 250,
                    '& .MuiMenuItem-root': {
                      fontFamily: theme.palette.typography.fontFamily,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.background.contrast,
                        '&:hover': {
                          backgroundColor: theme.palette.background.contrast,
                        },
                      },
                    },
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.background.contrast,
                      borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: theme.palette.background.contrast,
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: theme.palette.background.paper,
                    },
                  },
                },
                disableScrollLock: true,
                closeMenuOnScroll: true
              }}
            >
              <MenuItem sx={{ fontFamily: theme.palette.typography.fontFamily }} value="All">
                All Categories
              </MenuItem>
              {categories.map((category) => (
                <MenuItem
                  sx={{ fontFamily: theme.palette.typography.fontFamily }}
                  key={category.id}
                  value={category.id}
                >
                  {category.categoryName}
                </MenuItem>
              ))}
            </CustomSelect>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={6} md={6}>
          <FormControl fullWidth sx={{ fontFamily: theme.palette.typography.fontFamily }}
          >
            <InputLabel>Select Subcategory</InputLabel>
            <CustomSelect
              value={selectedSubcategory}
              label="Select Subcategory"
              onChange={(e) => handleSubcategoryChange(e.target.value)}
              disabled={!selectedCategory || selectedCategory === 'All'}
              sx={{
                fontFamily: theme.palette.typography.fontFamily,
                '& .MuiSelect-root': {
                  padding: '10px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.background.contrast,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.background.contrast,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 250,
                    '& .MuiMenuItem-root': {
                      fontFamily: theme.palette.typography.fontFamily,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.background.contrast,
                        '&:hover': {
                          backgroundColor: theme.palette.background.contrast,
                        },
                      },
                    },
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.background.contrast,
                      borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: theme.palette.background.contrast,
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: theme.palette.background.paper,
                    },
                  },
                },
                closeMenuOnScroll: true
              }}
            >
              <MenuItem sx={{ fontFamily: theme.palette.typography.fontFamily }} value="All">All Subcategory</MenuItem>
              {subcategories && subcategories?.map(subcategory => (
                <MenuItem sx={{ fontFamily: theme.palette.typography.fontFamily }} key={subcategory.id} value={subcategory.id}>{subcategory.subcategoryName}</MenuItem>
              ))}
            </CustomSelect>
          </FormControl>
        </Grid >

        {/* <Grid item xs={6} sm={6} md={6}>
          <FormControl fullWidth sx={{ fontFamily: theme.palette.typography.fontFamily }}
          >
            <Autocomplete
              options={categories || []}
              getOptionLabel={(option) => option.categoryName || ''}
              value={categories.find(category => category.id === selectedCategory) || null}
              onChange={(event, newValue) => handleCategoryChange(newValue?.id || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Category"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      fontFamily: theme.palette.typography.fontFamily,
                    },
                  }}
                  sx={{ fontFamily: theme.palette.typography.fontFamily }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} style={{ fontFamily: theme.palette.typography.fontFamily }}>
                  {option.categoryName}
                </li>
              )}
              ListboxProps={{
                sx: {
                  fontFamily: theme.palette.typography.fontFamily,
                },
              }}
              sx={{ fontFamily: theme.palette.typography.fontFamily }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={6} md={6}>
          <FormControl fullWidth sx={{ fontFamily: theme.palette.typography.fontFamily }}>
            <Autocomplete
              options={subcategories || []}
              getOptionLabel={(option) => option.subcategoryName || ''}
              value={subcategories.find(subcategory => subcategory.id === selectedSubcategory) || null}
              onChange={(event, newValue) => handleSubcategoryChange(newValue?.id || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Subcategory"
                  variant="outlined" InputProps={{
                    ...params.InputProps,
                    sx: {
                      fontFamily: theme.palette.typography.fontFamily,
                    },
                  }}
                  sx={{ fontFamily: theme.palette.typography.fontFamily }}
                />
              )}

              renderOption={(props, option) => (
                <li {...props} style={{ fontFamily: theme.palette.typography.fontFamily }}>
                  {option.subcategoryName}
                </li>
              )}
              ListboxProps={{
                sx: {
                  fontFamily: theme.palette.typography.fontFamily,
                },
              }}
              disabled={!selectedCategory}
            />
          </FormControl>
        </Grid> */}

      </Grid >
      <Grid container spacing={3} className="shop-page" style={{ padding: " 1% 2%" }}>
        <Grid container spacing={1} item xs={12}>
          {/* {inventory.map(item => (
            item?.productstatus === "PUBLISHED" && (
              <Grid key={item.id} item xs={6} sm={6} md={4} lg={2.4} xl={2}>
                <InventoryItem item={item} />
              </Grid>
            )
          ))} */}
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            inventory.length > 0 ?
              (
                <>
                  <Grid xs={12} sm={12} md={12} xl={12} p={1}>
                    <Typography>Total Items: {inventory?.length}</Typography>
                  </Grid>
                  {inventory.map(item => (
                    item?.productstatus === "PUBLISHED" && (
                      <Grid key={item.id} item xs={6} sm={6} md={4} lg={2.4} xl={2}>
                        <InventoryItem item={item} wishlistItems={wishlistItems} setWishlistItems={setWishlistItems} />
                      </Grid>
                    )
                  ))
                  }
                </>
              )
              : (
                <Grid item xs={12}>
                  <Typography variant="h6" align="center" p={5} mt={5} mb={25}>
                    Currently, there are no products available. Please check back soon for new arrivals and updates.
                  </Typography>
                </Grid>
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
              <CustomSelect
                value={`${sortBy}-${sortOrder}`}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="discountedPrice-asc">Price low to high</MenuItem>
                <MenuItem value="discountedPrice-desc">Price high to low</MenuItem>
                {/* <MenuItem value="sellingPrice-asc">Price low to high</MenuItem>
                <MenuItem value="sellingPrice-desc">Price high to low</MenuItem> */}
                <MenuItem value="updatedAt-asc">Date old to new</MenuItem>
                <MenuItem value="updatedAt-desc">Date new to old</MenuItem>
              </CustomSelect>
            </FormControl>
          )}
          {drawerContent === 'filter' && (
            <>
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel>Category</InputLabel>
                <CustomSelect
                  label="Category"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}

                  sx={{
                    fontFamily: theme.palette.typography.fontFamily,
                    '& .MuiSelect-root': {
                      padding: '10px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.background.contrast,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.background.contrast,
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 250,
                        '& .MuiMenuItem-root': {
                          fontFamily: theme.palette.typography.fontFamily,
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                          '&.Mui-selected': {
                            backgroundColor: theme.palette.background.contrast,
                            '&:hover': {
                              backgroundColor: theme.palette.background.contrast,
                            },
                          },
                        },
                        '&::-webkit-scrollbar': {
                          width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: theme.palette.background.contrast,
                          borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                          backgroundColor: theme.palette.background.contrast,
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: theme.palette.background.paper,
                        },
                      },
                    },
                    closeMenuOnScroll: true
                  }}
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel>Subcategory</InputLabel>
                <CustomSelect
                  label="Subcategory"
                  value={selectedSubcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}

                  sx={{
                    fontFamily: theme.palette.typography.fontFamily,
                    '& .MuiSelect-root': {
                      padding: '10px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.background.contrast,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.background.contrast,
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 250,
                        '& .MuiMenuItem-root': {
                          fontFamily: theme.palette.typography.fontFamily,
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                          '&.Mui-selected': {
                            backgroundColor: theme.palette.background.contrast,
                            '&:hover': {
                              backgroundColor: theme.palette.background.contrast,
                            },
                          },
                        },
                        '&::-webkit-scrollbar': {
                          width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: theme.palette.background.contrast,
                          borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                          backgroundColor: theme.palette.background.contrast,
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: theme.palette.background.paper,
                        },
                      },
                    },
                    closeMenuOnScroll: true
                  }}
                >
                  <MenuItem value="All">All Subcategories</MenuItem>
                  {subcategories && subcategories?.map(subcategory => (
                    <MenuItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.subcategoryName}
                    </MenuItem>
                  ))}
                </CustomSelect>
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
              </FormControl>
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
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel>Availability</InputLabel>
                <CustomSelect
                  value={extraOptionOutOfStock}
                  onChange={handleOutOfStockChange}
                  label="Availability"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="true">Out of stock</MenuItem>
                  <MenuItem value="false">In stock</MenuItem>
                </CustomSelect>
              </FormControl>

              <Grid container spacing={1} sx={{ marginTop: 0 }}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    onClick={handleResetFilters}
                    variant="contained"
                    sx={{ marginTop: 2 }}
                  >
                    Reset Filters
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button fullWidth onClick={handleFilterChange} variant="contained" color="primary" sx={{ marginTop: 2 }}>
                    Apply Filters
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};


const ShopPage = () => {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
};

export default ShopPage;