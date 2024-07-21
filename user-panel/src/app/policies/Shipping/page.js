import Head from 'next/head';
import { Container, Typography } from '@mui/material';

export default function ShippingPolicy() {
  return (
    <>
      <Head>
        <title>Shipping and Delivery Policy</title>
        <meta name="description" content="Shipping and Delivery Policy of our website" />
      </Head>
      <Container>
        <Typography variant="h2" component="h1" gutterBottom>
          Shipping and Delivery Policy
        </Typography>
        <Typography paragraph>
          Please read our shipping policy carefully to understand how we handle and deliver your orders.
        </Typography>
        <Typography variant="h5" component="h2">
          Prepaid Orders Only
        </Typography>
        <Typography paragraph>
          We accept only prepaid orders. Cash on Delivery (COD) is not available.
        </Typography>
        <Typography variant="h5" component="h2">
          Free Shipping
        </Typography>
        <Typography paragraph>
          We offer free shipping on all orders within India.
        </Typography>
        <Typography variant="h5" component="h2">
          International Shipping
        </Typography>
        <Typography paragraph>
          The cost of international shipping is borne by the client.
        </Typography>
        <Typography variant="h5" component="h2">
          Order Processing
        </Typography>
        <Typography paragraph>
          <strong>Dispatch Time:</strong> Orders are typically dispatched within 1-3 business days, excluding Sundays.
          <br />
          <strong>Delivery Time:</strong> Within India, orders usually arrive within 7-9 working days.
          <br />
          <strong>Express Shipping:</strong> If you require express shipping, please leave us a note on WhatsApp while placing your order. We will inform you of any additional charges for this service.
        </Typography>
        <Typography variant="h5" component="h2">
          Tracking and Updates
        </Typography>
        <Typography paragraph>
          We strive to keep our clients updated with the status of their orders and provide tracking details once the order is shipped. However, please note that delays caused by delivery partners and courier companies are beyond our control. We appreciate your patience if delivery takes longer than the estimated timeline.
        </Typography>
        <Typography variant="h5" component="h2">
          International Orders
        </Typography>
        <Typography paragraph>
          Delivery times for international orders may exceed the usual timeframe specified above.
          <br />
          Any import duties, customs duties, or taxes related to the shipment in the destination country will be the responsibility of the customer.
        </Typography>
        <Typography paragraph>
          Once your product is shipped, you will receive an update on your WhatsApp number.
        </Typography>
        <Typography paragraph>
          Thank you for your understanding and cooperation. We are committed to ensuring that your shopping experience with AYRU JAIPUR is smooth and satisfactory.
        </Typography>
      </Container>
    </>
  );
}
