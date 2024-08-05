"use client"
import Head from 'next/head';
import { Container, Typography, Link, Box, Grid, useTheme, Button } from '@mui/material';
import { FacebookIcon, FacebookShareButton, WhatsappIcon } from 'next-share';
import Insta from "../../../public/images/insta.png"
import Image from 'next/image';

export default function ContactUs() {
  const theme = useTheme();
  const whatsappMessage = ""
  return (
    <>
      <Head>
        <title>Contact Us</title>
        <meta name="description" content="Contact Us page of our website" />
      </Head>
      <Container maxWidth="md" sx={{ padding: theme.spacing(4), }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: "bolder" }}>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph align="left">
          We'd love to hear from you! We strive to respond to all inquiries within 24-48 hours.
          Please note that response times may be longer during weekends and holidays.
        </Typography>
        <Typography variant="body1" paragraph align="left">
          Connect with us using the information provided below ⬇️
        </Typography>
        <Box mt={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h2" gutterBottom>
                <Button
                  aria-label="Chat on WhatsApp"
                  href={`https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<WhatsappIcon style={{ height: "15px", width: "15px", padding: "0px", marginRight: "4px" }} />}
                  sx={{
                    color: '#25D366',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    mb: 0,
                    padding: "0px",
                  }}
                >
                  WhatsApp US
                </Button>
                {' '}
              </Typography>
              <Typography variant="body1" paragraph>
                +91-9785852222 between 11:00 AM and 5:00 PM, Monday to Saturday.
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1" paragraph>
                <Link href="mailto:ayrujaipur@gmail.com" color="inherit" sx={{ fontWeight: "bold" }}>ayrujaipur@gmail.com</Link>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* <Typography variant="h5" component="h2" gutterBottom>
                Contact Number
              </Typography>
              <Typography variant="body1" paragraph>
                +91-97858 52222
              </Typography> */}
              <Typography variant="h5" component="h2" gutterBottom>
                Social Media
              </Typography>
              <Box display="flex" justifyContent="left" alignItems="left" gap={1} mt={1}>
                <FacebookShareButton url="https://www.facebook.com/AYRU20?mibextid=LQQJ4d">
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <Link
                  target="_blank" href="https://www.instagram.com/handblock_ayrujaipur?igsh=MTkxbnBvZ3J3dW5ydA%3D%3D&utm_source=qr" passHref>
                  {/* <InstagramIcon size={32} round /> */}
                  <Image src={Insta} sidth={30} height={30} />
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" component="h2" gutterBottom>
                Operating Address
              </Typography>
              <Typography variant="body1" paragraph>
                Prangan, 302012, Jaipur, Rajasthan, INDIA
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
