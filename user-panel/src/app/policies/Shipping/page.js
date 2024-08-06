"use client";
import Head from 'next/head';
import { Container, Button, Box, useTheme } from '@mui/material';
import { WhatsappIcon } from 'next-share';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ShippingPolicy() {
  const theme = useTheme();
  const whatsappMessage = `Hi, I am interested in your Express shipping service.

Could you please provide me with the details regarding the process, any additional cost, and the estimated delivery time?`;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Shipping and Delivery Policy</title>
        <meta name="description" content="Shipping and Delivery Policy of our website" />
      </Head>
      <Container>
        <Box component="h1" sx={{ fontWeight: "bolder", marginTop: "5px", textAlign: 'center', fontSize: "2rem", marginBottom: "16px" }}>
          Shipping and Delivery Policy
        </Box>
        <Box component="p" sx={{ fontSize: "1rem", marginBottom: "16px" }}>
          Please read our shipping policy carefully to understand how we handle and deliver your orders.
        </Box>
        <Box component="h2" sx={{ fontWeight: "bolder", marginTop: "5px", fontSize: "1.5rem", marginBottom: "8px" }}>
          Prepaid Orders Only
        </Box>
        <Box component="p" sx={{ fontSize: "1rem", marginBottom: "16px" }}>
          We accept only prepaid orders. Cash on Delivery (COD) is not available.
        </Box>
        <Box component="h2" sx={{ fontWeight: "bolder", marginTop: "5px", fontSize: "1.5rem", marginBottom: "8px" }}>
          Free Shipping
        </Box>
        <Box component="p" sx={{ fontSize: "1rem", marginBottom: "16px" }}>
          We offer free shipping on all orders within India.
        </Box>
        <Box component="h2" sx={{ fontWeight: "bolder", marginTop: "5px", fontSize: "1.5rem", marginBottom: "8px" }}>
          International Shipping
        </Box>
        <Box component="p" sx={{ fontSize: "1rem", marginBottom: "16px" }}>
          International orders are accepted via WhatsApp only. The cost of international shipping is borne by the client.
        </Box>
        <Box component="h2" sx={{ fontWeight: "bolder", marginTop: "5px", fontSize: "1.5rem", marginBottom: "8px" }}>
          Order Processing
        </Box>
        <Box component="p" sx={{ fontSize: "1rem", marginBottom: "16px" }}>
          <strong>Dispatch Time:</strong> Orders are typically dispatched within 1-3 business days, excluding Sundays.
          <br />
          <strong>Delivery Time:</strong> Within India, orders usually arrive within 7-9 working days.
          <br />
          <strong>Express Shipping:</strong> If you require express shipping, please leave us a note on {' '}
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
          {' '} while placing your order. We will inform you of any additional charges for this service.
        </Box>
        <Box component="h2" sx={{ fontWeight: "bolder", marginTop: "5px", fontSize: "1.5rem", marginBottom: "8px" }}>
          Tracking and Updates
        </Box>
        <Box component="p" sx={{ fontSize: "1rem", marginBottom: "16px" }}>
          We strive to keep our clients updated with the status of their orders and provide tracking details once the order is shipped. However, please note that delays caused by delivery partners and courier companies are beyond our control. We appreciate your patience if delivery takes longer than the estimated timeline.
        </Box>
        <Box component="h2" sx={{ fontWeight: "bolder", marginTop: "5px", fontSize: "1.5rem", marginBottom: "8px" }} >
          International Orders
        </Box>
        <Box component="p" sx={{ fontSize: "1rem", marginBottom: "16px" }}>
          Delivery times for international orders may exceed the usual timeframe specified above.
          <br />
          Any import duties, customs duties, or taxes related to the shipment in the destination country will be the responsibility of the customer.
        </Box>
        <Box component="p" sx={{ fontSize: "1rem", marginBottom: "16px" }}>
          Once your product is shipped, you will receive an update on {' '}
          <span style={{ padding: '0', textDecoration: "underline", color: "#FFD54F", fontSize: "14px", cursor: "pointer" }} onClick={() => router.push("/orders")}>
            My Orders
          </span>
        </Box>
        <Box component="p" sx={{ fontSize: "1rem", marginBottom: "16px" }}>
          Thank you for your understanding and cooperation. We are committed to ensuring that your shopping experience with AYRU JAIPUR is smooth and satisfactory.
        </Box>
      </Container>
    </>
  );
}
