import React from 'react';
import { Box, Typography, useTheme, Grid, Paper, useMediaQuery } from '@mui/material';
import QualityImage from "../../public/images/quality.png";
import Image from 'next/image';
import WebpImage from "../../public/images/blog1.webp";


export const Quality = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: 'flex', paddingX: "50px", justifyContent: 'center', marginTop: 1, position: 'relative', width: '100%', backgroundColor: theme.palette.background.paper }}>
      <Image src={WebpImage} alt="Left Image" width={100} height={100} style={{ position: 'absolute', left: '-8px', top: isMobile ? "75%" : "65%", transform: 'translateY(-50%)', maxWidth: '20%', height: 'auto' }} />
      <Paper sx={{ padding: 2, textAlign: 'center', maxWidth: '800px', boxShadow: "none", fontFamily: theme.palette.typography.fontFamily }}>
        <Image src={QualityImage} alt="Premium Quality" width={50} height={50} style={{ maxWidth: '60%', height: 'auto', margin: 'auto' }} />
        <Typography variant="h6" gutterBottom={!isMobile}>
          Premium Quality
        </Typography>
        <Typography variant="body1" style={{ fontSize: "90%" }}>
          We prioritize the finest, high-quality, and pleasant products, that you can trust.
        </Typography>
      </Paper>
      <Image src={WebpImage} alt="Right Image" width={100} height={100} style={{ position: 'absolute', right: '-8px', top: isMobile ? "75%" : "65%", transform: 'translateY(-50%)', maxWidth: '20%', height: 'auto' }} />
    </Box>
  );
};
