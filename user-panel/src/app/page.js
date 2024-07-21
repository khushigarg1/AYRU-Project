"use client"
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ImageCarousel from '@/components/slider';
import { Note } from '@/components/Note';
import { InfoComponent } from '@/components/InfoContainer';
import ImageGrid from '@/components/imageContainer';
import { CraftedWithLove } from '@/components/CraftedWithLove';
import { Quality } from '@/components/QualityPremium';
import api from '../../api';
import "./app.css"
import { ProductSlider } from '@/components/productSlider';
import ClientLoveCarousel from '@/components/clientLove';
import Footer from '@/components/Footer';
import { FeedbackComponent } from '@/components/Extra/FeedbackComponent';

const Home = ({ openTab }) => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/inventory');
        // console.log(response?.data);
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching the products:', error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <Box style={{ padding: "0px" }}>
      <ImageCarousel />
      <Note />
      <ImageGrid />
      <InfoComponent />
      <ProductSlider products={products} />
      <Quality />
      <CraftedWithLove />
      <FeedbackComponent />
      <ClientLoveCarousel />
      {/* <Footer /> */}
    </Box>
  );
};

export default Home;
