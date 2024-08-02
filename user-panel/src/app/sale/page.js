"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { Grid, Select, MenuItem, FormControl, InputLabel, Box, Paper, Typography, useTheme, Button, Drawer, TextField, IconButton, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import api from '../../../api';
import InventoryItem from '@/components/Inventory/InventoryItem';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import WebpImage from '../../../public/images/blog1.webp';
import CloseIcon from '@mui/icons-material/Close';

const ShopPageContent = () => {
  const searchParams = useSearchParams();
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  useEffect(() => {
    fetchAllInventory();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      searchInventory();
    }
  }, [searchQuery]);

  const fetchAllInventory = () => {
    api.get('/inventory/sale')
      .then(response => {
        setInventory(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      });
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
            Sale Items
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
