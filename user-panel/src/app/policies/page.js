// pages/privacy-policy.js
import { Container, Typography, Box } from '@mui/material';
import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <Container>
        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="h6">What Personal Information We Collect</Typography>
          <Typography variant="subtitle1">
            We collect personal information such as name, email address, and payment details from our website/app users...
          </Typography>
          <Typography variant="h6">How We Collect Information</Typography>
          <Typography variant="subtitle1">
            Information is collected through forms, cookies, and tracking technologies...
          </Typography>
          <Typography variant="h6">How We Use Your Information</Typography>
          <Typography variant="subtitle1">
            We use the information to...
          </Typography>
          <Typography variant="h6">How We Keep Information Safe</Typography>
          <Typography variant="subtitle1">
            We implement security measures to protect your information...
          </Typography>
          <Typography variant="h6">Information Sharing with Third Parties</Typography>
          <Typography variant="subtitle1">
            We do not share personal information with third parties except...
          </Typography>
        </Box>
      </Container>
    </>
  );
}
