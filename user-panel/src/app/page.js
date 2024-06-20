"use client"
import React from 'react';
import { Box, Typography } from '@mui/material';
import ImageCarousel from '@/components/slider';
import { Note } from '@/components/Note';
import { InfoComponent } from '@/components/InfoContainer';
import ImageGrid from '@/components/imageContainer';

const Home = ({ openTab }) => {
  return (
    <Box style={{ padding: "0px" }}>
      <ImageCarousel />
      <Note />
      <ImageGrid />
      <InfoComponent />
    </Box>
  );
};

export default Home;
