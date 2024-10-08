"use client";
import React from 'react';
import { Typography, Container, Box, Button, List, ListItem, useTheme } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LanguageIcon from '@mui/icons-material/Language';

const InternationalOrders = () => {
  const whatsappURL = `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello,\n\nI would like to place an international order with AYRU JAIPUR. Could you please provide me with the details on the ordering process, shipping costs, and delivery times?\n\nThank you for your assistance.`
  )}`;
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, }}>
      <Typography variant="h4" gutterBottom>
        Worldwide Delivery
      </Typography>
      <Typography variant="subtitle1">
        At AYRU JAIPUR, we prioritize your time and understand the excitement of receiving your order promptly. Therefore, we ensure a swift and smooth delivery process worldwide.
      </Typography>
      <Typography variant="subtitle1">
        International orders are accepted via WhatsApp only.
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button
          aria-label="Chat on WhatsApp"
          href={whatsappURL}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<WhatsAppIcon sx={{ height: "20px", width: "20px", padding: "0px", marginRight: "4px" }} />}
          sx={{
            color: '#25D366',
            fontWeight: 'bold',
            textTransform: 'none',
            fontSize: "15px"
          }}
        >
          WhatsApp
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        Shipping Policy
      </Typography>
      <List>
        <ListItem alignItems="flex-start">
          <PublicIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            <strong>Third-Party Services:</strong> We use third-party shipping services to deliver our products. Shipping rates and zones are subject to changes determined by these companies.
          </Typography>
        </ListItem>
        <ListItem alignItems="flex-start">
          <AccessTimeIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            <strong>Standard Delivery Time:</strong> We dispatch orders in 3-4 days, except Sundays. For international orders, our standard delivery time is 7-9 working days after dispatch, depending on the country.
          </Typography>
        </ListItem>
        <ListItem alignItems="flex-start">
          <AttachMoneyIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            <strong>Shipping Rates:</strong> Rates are determined by shipping zones and the weight of the products ordered. Please reach out to us on WhatsApp for shipping rates.
          </Typography>
        </ListItem>
        <ListItem alignItems="flex-start">
          <MoneyOffIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            <strong>Remote Locations:</strong> If the delivery address falls into a remote location category, the customer will be informed of any extra charges applicable before the order is paid for.
          </Typography>
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom>
        Payment Terms
      </Typography>
      <List>
        <ListItem alignItems="flex-start">
          <CreditCardIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            <strong>Payment Methods:</strong> We accept bank transfers, credit/debit cards, and other secure payment methods.
          </Typography>
        </ListItem>
        <ListItem alignItems="flex-start">
          <AssignmentTurnedInIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            <strong>Deposit:</strong> A deposit may be required to confirm the order. The order will be dispatched only after the full payment has been completed.
          </Typography>
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom>
        Duties and Taxes
      </Typography>
      <List>
        <ListItem alignItems="flex-start">
          <AttachMoneyIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            As of today, we do not charge any taxes on international orders. However, any duties or taxes levied by the receiving country shall be borne by the customer. Please consult with your local authorities for details on applicable duties and taxes.
          </Typography>
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom>
        Tracking and Delivery
      </Typography>
      <List>
        <ListItem alignItems="flex-start">
          <Typography variant="subtitle1">
            We strive to support our clients with status updates and tracking details to ensure packages reach their destination on time. However, we have no control over delays caused by delivery partners and courier companies. In such cases, we request our clients to be patient, as it might take a little longer than the suggested timeline. For international orders, the delivery may take more than the usual time specified above.
          </Typography>
        </ListItem>
        <ListItem alignItems="flex-start">
          <Typography variant="subtitle1">
            We strongly recommend that you read and understand all the product details and specifications thoroughly, especially for products with size variations.
          </Typography>
        </ListItem>
      </List>
    </Container>
  );
};

export default InternationalOrders;
