import React from 'react';
import Link from 'next/link';
import { Box, Container, Grid, Typography, IconButton, useTheme } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  return (
    <Box sx={{ bgcolor: theme.palette.background.primary, color: 'black', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Footer Column 1 */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Company Name
            </Typography>
            <Typography variant="body1" gutterBottom>
              A brief description of the company.
            </Typography>
          </Grid>

          {/* Footer Column 2 */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Link href="/">Home</Link>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Link href="/about">About Us</Link>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Link href="/contact">Contact Us</Link>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Link href="#">International Orders</Link>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Link href="#">Bulk & Corporate Orders</Link>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              My Policies
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Link href="/policies/Shipping">Shipping Policy</Link>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Link href="/policies/cancellation">Cancellation Policy</Link>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Link href="/policies/privacy">Privacy Policy</Link>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Link href="/policies/Exchange-refund">Exchange & Refund Policy</Link>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Link href="/policies/termsCondition">Terms of Service</Link>
            </Typography>
          </Grid>

          {/* Footer Column 4 */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Info
            </Typography>
            <Typography variant="body1" gutterBottom>
              Address: 123 Street, City, Country
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: info@example.com
            </Typography>
            <Typography variant="body1" gutterBottom>
              Phone: +1234567890
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="h6" gutterBottom>
            Follow Us
          </Typography>
          <IconButton aria-label="Facebook" color="inherit">
            <Facebook />
          </IconButton>
          <IconButton aria-label="Instagram" color="inherit">
            <Instagram />
          </IconButton>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
