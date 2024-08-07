import React, { useState } from 'react';
import Link from 'next/link';
import { Box, Container, Grid, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import Image from 'next/image';
import Img from "../../public/images/footer.JPEG";
import { FacebookShareButton, InstagramIcon, TwitterShareButton, WhatsappShareButton } from 'next-share';
import { FacebookIcon, TwitterIcon, WhatsappIcon } from 'next-share';
import Insta from "../../public/images/insta.png"
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState({});

  const handleExpandClick = (panel) => {
    setExpanded((prev) => ({ ...prev, [panel]: !prev[panel] }));
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.primary, color: 'black', paddingBottom: "10px" }} mt={0} >
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" gutterBottom>
                  <Link href="/orders">My Order</Link>
                </Typography>
              </Grid>
              {/* Footer Column 1 */}

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
                    <Typography variant="subtitle1" mt={1}><Link href="/">Home</Link></Typography>
                    <Typography variant="subtitle1"><Link href="/about">About Us</Link></Typography>
                    <Typography variant="subtitle1"><Link href="/contact">Contact Us</Link></Typography>
                    <Typography variant="subtitle1"><Link href="/international-order">International Orders</Link></Typography>
                    <Typography variant="subtitle1"><Link href="/bulk-corporate">Bulk & Corporate Orders</Link></Typography>
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
                    <Typography variant="subtitle1" mt={1}><Link href="/policies/Shipping">Shipping Policy</Link></Typography>
                    <Typography variant="subtitle1"><Link href="/policies/cancellation">Cancellation Policy</Link></Typography>
                    <Typography variant="subtitle1"><Link href="/policies/privacy">Privacy Policy</Link></Typography>
                    <Typography variant="subtitle1"><Link href="/policies/Exchange-refund">Exchange & Refund Policy</Link></Typography>
                    <Typography variant="subtitle1"><Link href="/policies/termsCondition">Terms of Service</Link></Typography>
                  </>
                )}
              </Grid>

              {/* Footer Column 4 */}
              {/* <Grid item xs={12} sm={6} md={3}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">Contact Info</Typography>
                  <IconButton onClick={() => handleExpandClick('panel4')}>
                    {expanded['panel4'] ? <Remove /> : <Add />}
                  </IconButton>
                </Box>
                {expanded['panel4'] && (
                  <>
                    <Typography variant="subtitle1" mt={1}>Address: Prangan, Jaipur, Rajasthan-302012 , INDIA </Typography>
                    <Typography variant="subtitle1">Email: ayrujaipur@gmail.com</Typography>
                    <Typography variant="subtitle1">Phone: +91-9785852222</Typography>
                  </>
                )}
              </Grid> */}

              <Grid item xs={12} md={3} mb={2}>
                <Typography variant="h6" gutterBottom>
                  Contact Info
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <LocationOnOutlinedIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Prangan, Jaipur, Rajasthan-302012 , INDIA
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={1}>
                  <EmailOutlinedIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Email: ayrujaipur@gmail.com
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={1}>
                  <PhoneOutlinedIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Phone: +91-9785852222
                  </Typography>
                </Box>

                {/* <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">Follow Us</Typography>
                </Box> */}
                <Box display="flex" justifyContent="left" alignItems="left" gap={1} mt={2}>
                  <FacebookShareButton url="https://www.facebook.com/AYRU20?mibextid=LQQJ4d">
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <Link
                    target="_blank" href="https://www.instagram.com/handblock_ayrujaipur?igsh=MTkxbnBvZ3J3dW5ydA%3D%3D&utm_source=qr" passHref>
                    {/* <InstagramIcon size={32} round /> */}
                    <Image alt="insta" src={Insta} sidth={30} height={30} />
                  </Link>
                </Box>
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
                  <Link href="/orders">My Order</Link>
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Follow Us
                </Typography>
                <Box display="flex" justifyContent="left" alignItems="left" gap={1} mt={1}>
                  <FacebookShareButton url="https://www.facebook.com/AYRU20?mibextid=LQQJ4d">
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <Link
                    target="_blank" href="https://www.instagram.com/handblock_ayrujaipur?igsh=MTkxbnBvZ3J3dW5ydA%3D%3D&utm_source=qr" passHref>
                    {/* <InstagramIcon size={32} round /> */}
                    <Image alt="insta" src={Insta} sidth={30} height={30} />
                  </Link>
                </Box>
              </Grid>

              {/* Footer Column 2 */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" gutterBottom>
                  Quick Links
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Link href="/">Home</Link>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Link href="/about">About Us</Link>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Link href="/contact">Contact Us</Link>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Link href="/international-order">International Orders</Link>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Link href="/bulk-corporate">Bulk & Corporate Orders</Link>
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" gutterBottom>
                  My Policies
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Link href="/policies/Shipping">Shipping Policy</Link>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Link href="/policies/cancellation">Cancellation Policy</Link>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Link href="/policies/privacy">Privacy Policy</Link>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Link href="/policies/Exchange-refund">Exchange & Refund Policy</Link>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <Link href="/policies/termsCondition">Terms of Service</Link>
                </Typography>
              </Grid>

              {/* Footer Column 4 */}
              <Grid item xs={12} md={3}>
                <Typography variant="h6" gutterBottom>
                  Contact Info
                </Typography>
                <Box display="flex" alignItems="center" mt={1} gap={1}>
                  <LocationOnOutlinedIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Prangan, Jaipur, Rajasthan-302012 , INDIA
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={1}>
                  <EmailOutlinedIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Email: ayrujaipur@gmail.com
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={1}>
                  <PhoneOutlinedIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Phone: +91-9785852222
                  </Typography>
                </Box>
              </Grid>
            </Grid>

          </Container>
        )
      }

    </Box>
  );
};

export default Footer;
