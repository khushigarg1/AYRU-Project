"use client"
import React from 'react';
import { Typography, Container, Box, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { WhatsappIcon } from 'next-share';

const BulkCorporateOrders = () => {
  const whatsappURL = `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello,\n\nI would like to place a bulk or corporate order with AYRU JAIPUR. Could you please provide me with details on the ordering process, minimum order quantities, pricing, shipping costs, and delivery times?\n\nThank you!`
  )}`;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bulk and Corporate Orders
      </Typography>
      <Typography paragraph>
        At AYRU JAIPUR, we specialize in providing high-quality hand-block products suitable for bulk and corporate orders. Whether you're looking to place a large order for a special event, corporate gifting, or to stock your retail store, we offer competitive wholesale pricing and reliable service to meet your needs.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Why Choose Us for Bulk and Corporate Orders?
      </Typography>
      <List>
        <ListItem alignItems="flex-start">
          <ListItemIcon>
            <ShoppingCartIcon sx={{ mt: '4px' }} />
          </ListItemIcon>
          <ListItemText
            primary={<strong>High-Quality Products</strong>}
            secondary="Our products are crafted with the utmost care and precision, ensuring you receive only the best."
          />
        </ListItem>
        <ListItem alignItems="flex-start">
          <ListItemIcon>
            <AttachMoneyIcon sx={{ mt: '4px' }} />
          </ListItemIcon>
          <ListItemText
            primary={<strong>Competitive Pricing</strong>}
            secondary="We offer attractive wholesale prices that provide excellent value for bulk purchases."
          />
        </ListItem>
        <ListItem alignItems="flex-start">
          <ListItemIcon>
            <LocalShippingIcon sx={{ mt: '4px' }} />
          </ListItemIcon>
          <ListItemText
            primary={<strong>Reliable Delivery</strong>}
            secondary="Our robust delivery network ensures that your orders are delivered promptly and securely."
          />
        </ListItem>
        <ListItem alignItems="flex-start">
          <ListItemIcon>
            <ShoppingCartIcon sx={{ mt: '4px' }} />
          </ListItemIcon>
          <ListItemText
            primary={<strong>Custom Orders</strong>}
            secondary="We can accommodate custom orders to match your specific requirements, including personalized designs and packaging."
          />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom>
        Minimum Order Quantities (MOQ) and Pricing
      </Typography>
      <Typography paragraph>
        Our minimum order quantities (MOQ) and wholesale prices vary depending on the type and quantity of products you wish to order. We aim to provide flexible solutions to suit different business needs.
      </Typography>
      <Typography paragraph>
        For detailed information about our MOQs and pricing, please
        contact us on
        <Button
          aria-label="Chat on WhatsApp"
          href={whatsappURL}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<WhatsAppIcon sx={{ height: '15px', width: '15px' }} />}
          sx={{
            color: '#25D366',
            fontWeight: 'bold',
            textTransform: 'none',
            padding: '0px',
            // fontSize: '15px',
            '&:hover': {
              backgroundColor: '#25D366',
              color: '#ffffff',
            },
            ml: 1,
            mr: 1// Margin left to add space between text and button
          }}
        >
          WhatsApp
        </Button>
        Our team will be happy to assist you and provide all the necessary details to help you make an informed decision.
      </Typography>

      <Typography paragraph>
        Please reach out to us on WhatsApp for more information about bulk and corporate orders, or to discuss your specific needs. We look forward to partnering with you to provide the best hand-block products for your requirements.
      </Typography>

      <Typography paragraph>
        At AYRU JAIPUR, we value our clients and strive to offer exceptional service and high-quality products. Let us help you make your next bulk or corporate order a success.
      </Typography>
    </Container>
  );
};

export default BulkCorporateOrders;
