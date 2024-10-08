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
        const sortedCategories = response.data.data.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        setCategories(sortedCategories);
        setCategoryInventory(response.data.data[selectedCategory]?.Inventory.slice(0, isMobile ? 4 : 5));
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
        <Typography variant='subtitle1' sx={{ mt: 2, mb: 3, textAlign: 'center', fontSize: "14px" }}>
          Explore the timeless beauty and elegance of Hand-Block Printing
        </Typography>
      </Box>
      <Tabs
        value={selectedCategory}
        onChange={handleCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        sx={{ width: isMobile ? "100%" : "50%", borderBottom: 1, borderColor: 'divider', fontFamily: theme.palette.typography.fontFamily }}
      >
        {categories.map((category, index) => (
          <Tab key={category.id} label={category.categoryName} sx={{ fontFamily: theme.palette.typography.fontFamily }} />
        ))}
      </Tabs>
      {selectedCategory !== null && (
        <Box sx={{ width: isMobile ? '100%' : "80%", mt: 4 }}>
          <Grid container spacing={2}>
            {categoryInventory.length == 0 &&
              <Typography
                sx={{
                  display: "flex",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%"
                }}
              >
                No products found in this category
              </Typography>
            }

            {categoryInventory?.map((item) => (
              <Grid item key={item.id} xs={6} sm={6} md={4} lg={2.4}>
                <Card sx={{
                  height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: "transparent", p: 0, cursor: "pointer"
                  ,
                  borderRadius: "0px"

                }} onClick={() => router.push(`/shop/${item?.id}`)}>
                  <CardMedia
                    component="img"
                    // height="250"
                    image={item.Media && item.Media.length > 0 ? `https://ayrujaipur.s3.amazonaws.com/${item.Media[0].url}` : '/fallback_image_url'}
                    alt={item.productName}

                    sx={{
                      objectFit: 'fit',
                      height: isMobile ? "250px" : "300px",
                      maxHeight: "100%",
                      // borderRadius: "5px"
                    }}
                  />
                  <CardContent sx={{
                    display: "flex", justifyContent: "left", alignItems: "left", flexDirection: "column", padding: "5px 3px",
                    paddingBottom: "0px !important",
                  }}>
                    <Typography gutterBottom variant="body1" component="div" sx={{ lineHeight: 1.2 }}
                    // sx={{
                    //   lineHeight: 1.2,
                    //   overflow: 'hidden',
                    //   textOverflow: 'ellipsis',
                    //   display: '-webkit-box',
                    //   WebkitLineClamp: 2, // Limits the text to 2 lines
                    //   WebkitBoxOrient: 'vertical',
                    //   wordBreak: 'break-all', // Breaks the word at the boundary
                    //   hyphens: 'auto' // Adds a hyphen when the word is broken
                    // }}
                    >
                      {item.productName}
                    </Typography>

                    {item?.discountedPrice ? (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {/* <Typography variant="body2">
                          <strong>MRP</strong>
                        </Typography> */}
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', fontSize: "14px" }}>
                          ₹{item.sellingPrice}
                        </Typography>
                        <Typography variant="body1" sx={{ marginRight: "3px", fontSize: "14px", fontWeight: "bold" }} >
                          ₹{item.discountedPrice}
                        </Typography>
                        {/* <Typography variant="body2" color="error" sx={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #FF5733 100%, #FFC300 30%)',
                        padding: '0px 10px',
                        borderRadius: '1px',
                        clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)',
                        color: "white",
                      }}>
                        {`${Math.round(((product.sellingPrice? - product.discountedPrice?) / product.sellingPrice?) * 100)}% OFF!`}
                      </Typography> */}
                      </Box>
                    ) : (
                      <Typography variant="body1" sx={{ marginRight: "3px", fontSize: "14px", fontWeight: "bold" }} >
                        ₹{item.sellingPrice}
                      </Typography>
                    )}
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
