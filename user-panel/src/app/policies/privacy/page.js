"use client";
import Head from 'next/head';
import { Button, Container, Typography, useTheme } from '@mui/material';
import { WhatsappIcon } from 'next-share';

export default function PrivacyPolicy() {
  // const whatsappMessage = "";
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Privacy Policy</title>
        <meta name="description" content="Privacy Policy of AYRU JAIPUR website" />
      </Head>
      <Container >
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: "bolder", fontSize: "33px" }}>
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1">
          At AYRU JAIPUR, we are committed to protecting your privacy. This privacy policy outlines how we handle and protect your personal information.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bolder", marginTop: "5px" }}>
          What Information We Collect
        </Typography>
        <Typography variant="subtitle1">
          We collect the following personal information from our users:
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Shipping and billing address</li>
            <li>Payment information</li>
            <li>Order history</li>
          </ul>
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bolder", marginTop: "5px" }}>
          How We Collect Information
        </Typography>
        <Typography variant="subtitle1">
          We collect information from you when you:
          <ul>
            <li>Register on our website</li>
            <li>Place an order</li>
            <li>When you add items to your cart or wishlist</li>
            {/* <li>Subscribe to our newsletter</li>
            <li>Fill out a form or enter information on our site</li> */}
          </ul>
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bolder", marginTop: "5px" }}>
          How We Use Collected Information
        </Typography>
        <Typography variant="subtitle1">
          The information we collect is used in the following ways:
          <ul>
            <li>To personalize your experience on our website</li>
            <li>To improve our website and services</li>
            <li>To process transactions efficiently</li>
            <li>To send periodic emails regarding your order or other products and services</li>
          </ul>
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bolder", marginTop: "5px" }}>
          How We Keep Information Safe
        </Typography>
        <Typography variant="subtitle1">
          We implement various security measures to maintain the safety of your personal information. Your personal information is contained behind
          secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. Additionally, all sensitive information you supply is encrypted via Secure Socket Layer (SSL) technology.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bolder", marginTop: "5px" }}>
          Information Sharing with Third Parties
        </Typography>
        <Typography variant="subtitle1">
          We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when it's release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property or safety.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bolder", marginTop: "5px" }}>
          Effective Date
        </Typography>
        {/* <Typography variant="subtitle1">
          This Privacy Policy is effective as of [Effective Date].
        </Typography> */}
        <Typography variant="subtitle1">
          If you have any questions about this Privacy Policy, please contact us at:
          <br />
          WhatsApp: +91-9785852222
          {/*
          {' '}
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
            WhatsApp
          </Button>
          {' '}
          */}
          <br />
          Email: ayrujaipur@gmail.com
          <br />
          Address: Prangan, 302012, Jaipur, Rajasthan, INDIA
        </Typography>
        <Typography variant="subtitle1">
          By using our site, you consent to our website's privacy policy.
        </Typography>
      </Container>
    </>
  );
}
