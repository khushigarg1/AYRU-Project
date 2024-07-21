import Head from 'next/head';
import { Container, Typography } from '@mui/material';

export default function CancellationAndRefundPolicy() {
  return (
    <>
      <Head>
        <title>Cancellation and Refund Policy</title>
        <meta name="description" content="Cancellation and Refund Policy of our website" />
      </Head>
      <Container>
        <Typography variant="h2" component="h1" gutterBottom>
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
          If you have any questions or need further assistance, please don't hesitate to connect with us on WhatsApp +91-9785852222.
        </Typography>
        <Typography paragraph>
          Thank you for your understanding and cooperation.
        </Typography>
      </Container>
    </>
  );
}
