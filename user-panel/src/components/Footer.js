import React, { useState } from 'react';
import Link from 'next/link';
import { Box, Container, Grid, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Add, Remove, Facebook, Instagram } from '@mui/icons-material';
import Image from 'next/image';
import Img from "../../public/images/footer.JPEG";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState({});

  const handleExpandClick = (panel) => {
    setExpanded((prev) => ({ ...prev, [panel]: !prev[panel] }));
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.primary, color: 'black' }} mt={4}>
      {isMobile ?
        (<>
          <Image src={Img} alt="Welcome to AYRU JAIPUR" style={{
            width: '100%',
            height: 'auto',
            borderRadius: '0px',
            marginBottom: '8px',
            objectFit: "cover",
            opacity: "0.6",
            backgroundColor: "white"
          }} mt={0} />
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              {/* Footer Column 1 */}
              <Grid item xs={12} sm={6} md={3}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">Company Name</Typography>
                </Box>
                <Typography variant="body1" mt={1}>
                  A brief description of the company.
                </Typography>
              </Grid>

              {/* Footer Column 2 */}
              <Grid item xs={12} sm={6} md={3}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">Quick Links</Typography>
                  <IconButton onClick={() => handleExpandClick('panel2')}>
                    {expanded['panel2'] ? <Remove /> : <Add />}
                  </IconButton>
                </Box>
                {expanded['panel2'] && (
                  <>
                    <Typography variant="body1" mt={1}><Link href="/">Home</Link></Typography>
                    <Typography variant="body1"><Link href="/about">About Us</Link></Typography>
                    <Typography variant="body1"><Link href="/contact">Contact Us</Link></Typography>
                    <Typography variant="body1"><Link href="#">International Orders</Link></Typography>
                    <Typography variant="body1"><Link href="#">Bulk & Corporate Orders</Link></Typography>
                  </>
                )}
              </Grid>

              {/* Footer Column 3 */}
              <Grid item xs={12} sm={6} md={3}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">My Policies</Typography>
                  <IconButton onClick={() => handleExpandClick('panel3')}>
                    {expanded['panel3'] ? <Remove /> : <Add />}
                  </IconButton>
                </Box>
                {expanded['panel3'] && (
                  <>
                    <Typography variant="body1" mt={1}><Link href="/policies/Shipping">Shipping Policy</Link></Typography>
                    <Typography variant="body1"><Link href="/policies/cancellation">Cancellation Policy</Link></Typography>
                    <Typography variant="body1"><Link href="/policies/privacy">Privacy Policy</Link></Typography>
                    <Typography variant="body1"><Link href="/policies/Exchange-refund">Exchange & Refund Policy</Link></Typography>
                    <Typography variant="body1"><Link href="/policies/termsCondition">Terms of Service</Link></Typography>
                  </>
                )}
              </Grid>

              {/* Footer Column 4 */}
              <Grid item xs={12} sm={6} md={3}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">Contact Info</Typography>
                  <IconButton onClick={() => handleExpandClick('panel4')}>
                    {expanded['panel4'] ? <Remove /> : <Add />}
                  </IconButton>
                </Box>
                {expanded['panel4'] && (
                  <>
                    <Typography variant="body1" mt={1}>Address: 123 Street, City, Country</Typography>
                    <Typography variant="body1">Email: info@example.com</Typography>
                    <Typography variant="body1">Phone: +1234567890</Typography>
                  </>
                )}
              </Grid>

              {/* Follow Us Section */}
              <Grid item xs={12} sm={6} md={3}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">Follow Us</Typography>
                </Box>
                <>
                  <IconButton aria-label="Facebook" color="inherit">
                    <Facebook />
                  </IconButton>
                  <IconButton aria-label="Instagram" color="inherit">
                    <Instagram />
                  </IconButton>
                </>
              </Grid>
            </Grid>
          </Container>
        </>
        )
        : (
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
        )
      }

    </Box>
  );
};

export default Footer;
