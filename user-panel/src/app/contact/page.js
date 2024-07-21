import Head from 'next/head';
import { Container, Typography, Link, Box } from '@mui/material';

export default function ContactUs() {
  return (
    <>
      <Head>
        <title>Contact Us</title>
        <meta name="description" content="Contact Us page of our website" />
      </Head>
      <Container>
        <Typography variant="h2" component="h1" gutterBottom>
          Contact Us
        </Typography>
        <Typography paragraph>
          We'd love to hear from you! We strive to respond to all inquiries within 24-48 hours.
          Please note that response times may be longer during weekends and holidays.
        </Typography>
        <Typography paragraph>
          Connect with us using the information provided below ⬇️
        </Typography>
        <Box mt={4}>
          <Typography variant="h5" component="h2">
            Whatsapp Us
          </Typography>
          <Typography paragraph>
            +91-9785852222 between 11:00 AM and 5:00 PM, Monday to Saturday.
          </Typography>
          <Typography variant="h5" component="h2">
            Email
          </Typography>
          <Typography paragraph>
            <Link href="mailto:ayrujaipur@gmail.com">ayrujaipur@gmail.com</Link>
          </Typography>
          <Typography variant="h5" component="h2">
            Contact Number
          </Typography>
          <Typography paragraph>
            +91-97858 52222
          </Typography>
          <Typography variant="h5" component="h2">
            Social Media
          </Typography>
          <Typography paragraph>
            <Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</Link>
          </Typography>
          <Typography paragraph>
            <Link href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</Link>
          </Typography>
          <Typography variant="h5" component="h2">
            Operating Address
          </Typography>
          <Typography paragraph>
            Prangan, 302012, Jaipur, Rajasthan, INDIA
          </Typography>
        </Box>
      </Container>
    </>
  );
}
