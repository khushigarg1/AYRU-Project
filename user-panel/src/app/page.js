"use client"
import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
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
import FloatingWhatsAppButton from '@/components/floatingButton';
import Marquee from '@/components/marquee';

const Home = ({ openTab }) => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);

  const [marqueeText, setMarqueeText] = useState("");

  useEffect(() => {
    const fetchMarqueeText = async () => {
      try {
        const response = await api.get("/customer-side-data/1");
        setMarqueeText(response.data.data.marqueeText || '');
      } catch (error) {
        console.error("Error fetching marquee text:", error);
      }
    };

    fetchMarqueeText();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/inventory');
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching the products:', error);
      }
    };

    fetchProducts();
  }, []);
  return (
    <Box style={{ padding: "0px", fontFamily: theme.palette.typography.fontFamily }}>
      {/* <Marquee text={marqueeText} /> */}
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
