import React, { useEffect, useState } from 'react';
import { Box, Button, Tab, Tabs, Typography, Grid, Card, CardContent, CardMedia, useTheme, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import api from '../../api';

export const CraftedWithLove = () => {
  const theme = useTheme();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [categoryInventory, setCategoryInventory] = useState([]);
  const [loadMoreUrl, setLoadMoreUrl] = useState(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchVisibleCategories = async () => {
      try {
        const response = await api.get('/categories/visible');
        setCategories(response.data.data);
        setCategoryInventory(response.data.data[selectedCategory]?.Inventory.slice(0, 4));
        setLoadMoreUrl(`/shop?categoryId=${response.data.data[selectedCategory]?.id}`);
      } catch (error) {
        console.error('Error fetching visible categories:', error);
      }
    };

    fetchVisibleCategories();
  }, []);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setCategoryInventory(categories[newValue]?.Inventory.slice(0, 4));
    setLoadMoreUrl(`/shop?categoryId=${categories[newValue]?.id}`);
    // setLoadMoreUrl(`/shop/${categories[newValue]?.id}`);
  };

  const handleLoadMore = () => {
    if (loadMoreUrl) {
      router.push(loadMoreUrl);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "2%", p: "1%", fontFamily: theme.palette.text.fontFamily }}>
      <Box style={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant={isMobile ? 'h4' : 'h3'} sx={{ mt: 2, color: theme.palette.text.text }}>
          All Categories
        </Typography>
        <Typography variant='body1' sx={{ mt: 3, mb: 3, textAlign: 'center', fontSize: "14px" }}>
          Explore the timeless beauty and elegance of Hand-Block Printing
        </Typography>
      </Box>
      <Tabs
        value={selectedCategory}
        onChange={handleCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        sx={{ width: isMobile ? "100%" : "50%", borderBottom: 1, borderColor: 'divider' }}
      >
        {categories.map((category, index) => (
          <Tab key={category.id} label={category.categoryName} />
        ))}
      </Tabs>
      {selectedCategory !== null && (
        <Box sx={{ width: isMobile ? '100%' : "80%", mt: 4 }}>
          <Grid container spacing={2}>
            {categoryInventory?.map((item) => (
              <Grid item key={item.id} xs={6} sm={6} md={4} lg={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: "transparent", p: 0 }}>
                  <CardMedia
                    component="img"
                    // height="250"
                    image={item.Media && item.Media.length > 0 ? `https://ayrujaipur.s3.amazonaws.com/${item.Media[0].url}` : '/fallback_image_url'}
                    alt={item.productName}

                    sx={{
                      objectFit: 'contain',
                      height: "250px",
                      maxHeight: "100%",
                    }}
                  />
                  <CardContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", }}>
                    <Typography gutterBottom variant="body1" component="div" sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                      {item.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: {item.sellingPrice} USD
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="contained" onClick={handleLoadMore}>
              Load More
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CraftedWithLove;
