"use client"
import Head from 'next/head';
import { Button, Container, Typography, useTheme } from '@mui/material';
import { WhatsappIcon } from 'next-share';

export default function CancellationAndRefundPolicy() {
  const theme = useTheme();
  // const whatsappMessage = "";
  return (
    <>
      <Head>
        <title>Cancellation and Refund Policy</title>
        <meta name="description" content="Cancellation and Refund Policy of our website" />
      </Head>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: "bolder" }}>
          Cancellation and Refund Policy
        </Typography>
        <Typography paragraph>
          Please read our cancellation policy carefully.
        </Typography>
        <Typography variant="h5" component="h2">
          No Cancellations or Modifications
        </Typography>
        <Typography paragraph>
          Once an order has been placed and payment has been processed, it cannot be cancelled or modified. This policy helps us streamline our operations and maintain efficiency. Our system is designed to process orders promptly, making it challenging to accommodate cancellations after the order is submitted.
        </Typography>
        <Typography paragraph>
          If you have any questions or need further assistance, please don't hesitate to connect with us.
          {/* on {' '} */}
          {/* <Button
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
          {' '}. */}
        </Typography>
        <Typography paragraph>
          Thank you for your understanding and cooperation.
        </Typography>
      </Container>
    </>
  );
}
