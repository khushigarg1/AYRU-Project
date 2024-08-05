"use client";
import React from 'react';
import Image from 'next/image';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import First from "../../../public/images/about/first.JPG";
import Second from "../../../public/images/about/second.JPG";
import Third from "../../../public/images/about/third.JPG";
import Fourth from "../../../public/images/about/fourth.JPG";
import Fifth from "../../../public/images/about/fifth.JPG";


// const Image = styled('img')({
//   width: '100%',
//   height: 'auto',
//   borderRadius: '8px',
//   marginBottom: '8px',
// });

const AboutUs = () => {
  const theme = useTheme();
  return (
    <Container maxWidth="md" style={{ padding: '24px' }} sx={{ fontFamily: theme.palette.typography.fontFamily2 }}>
      <Box style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Typography variant="h4" gutterBottom>About Us</Typography>
      </Box>

      <Box>
        <Image src={First} alt="Welcome to AYRU JAIPUR" style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
          marginBottom: '8px',
        }} />
        <Typography variant="body1" paragraph>
          Welcome to AYRU JAIPUR, your go-to online store for exquisite sustainable handblock prints. We offer a diverse selection of handcrafted lifestyle products, including bed linen, table linen, bath linen, accessories, and more.
        </Typography>
      </Box>

      <Box>
        <Image src={Second} alt="Sustainability at AYRU JAIPUR" style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
          marginBottom: '8px',
        }} />
        <Typography variant="body1" paragraph>
          Our commitment to sustainability is evident in our choice of materials, which are all eco-friendly and responsibly sourced. Every product at AYRU JAIPUR is handmade, reflecting a harmonious blend of unique, traditional, modern, and contemporary styles.
        </Typography>
      </Box>

      <Box>
        <Image src={Third} alt="Color Palette at AYRU JAIPUR" style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
          marginBottom: '8px',
        }} />
        <Typography variant="body1" paragraph>
          Our thoughtfully curated color palette features everything from soft pastels to bold, vibrant shades, ensuring our products enhance and accentuate any home décor.
        </Typography>
      </Box>

      <Box>
        <Image src={Fourth} alt="Quality at AYRU JAIPUR" style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
          marginBottom: '8px',
        }} />
        <Typography variant="body1" paragraph>
          At AYRU Jaipur, quality is our top priority. We take pride in delivering superior products that not only meet but exceed our customers’ expectations. This dedication to excellence has garnered us recognition and a loyal customer base both locally and internationally.
        </Typography>
      </Box>

      <Box>
        <Image src={Fifth} alt="Elegance at AYRU JAIPUR" style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
          marginBottom: '8px',
        }} />
        <Typography variant="body1" paragraph>
          Discover the charm of handcrafted elegance with AYRU JAIPUR, where sustainability and style converge to create beautiful living spaces.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;
