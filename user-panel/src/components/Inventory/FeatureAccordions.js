import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Link, List, ListItem, ListItemText, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const FeatureAccordions = ({ product }) => {
  console.log(product);
  const sections = [
    { title: "Description", content: product.description || "No description available" },
    {
      title: "Product Details", content: (
        <List>
          <ListItem><ListItemText primary="Style" secondary={product.style || "N/A"} /></ListItem>
          <ListItem><ListItemText primary="Pattern" secondary={product.pattern || "N/A"} /></ListItem>
          <ListItem><ListItemText primary="Fabric" secondary={product.fabric || "N/A"} /></ListItem>
          <ListItem><ListItemText primary="Included Items" secondary={product.includedItems || "N/A"} /></ListItem>
          <ListItem><ListItemText primary="Size" secondary={product.size || "N/A"} /></ListItem>
          <ListItem><ListItemText primary="Item Dimensions" secondary={product.itemDimensions.length > 0 ? product.itemDimensions.join(", ") : "N/A"} /></ListItem>
          <ListItem><ListItemText primary="Item Weight" secondary={product.weight || "N/A"} /></ListItem>
          <ListItem><ListItemText primary="Thread Count" secondary={product.threadCount || "N/A"} /></ListItem>
          <ListItem><ListItemText primary="Special Features" secondary={product.specialFeatures ? product.specialFeatures.join(", ") : "N/A"} /></ListItem>
          <ListItem><ListItemText primary="Origin" secondary={product.origin || "N/A"} /></ListItem>
          <ListItem><ListItemText primary="Others" secondary={product.others || "N/A"} /></ListItem>
        </List>
      )
    },
    { title: "Care Instructions", content: product.careInstructions.length > 0 ? product.careInstructions.join(", ") : "No instructions available" },
    { title: "Disclaimer", content: product.disclaimer || "No disclaimer available" },
  ];

  return (
    <Box sx={{ padding: 1 }}>
      <Box sx={{ marginTop: 4 }}>
        {sections.map((section, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{section.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {typeof section.content === 'string' ? (
                <Typography>{section.content}</Typography>
              ) : (
                section.content
              )}
            </AccordionDetails>
          </Accordion>
        ))}

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Shipping Policy</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              • Free Shipping within INDIA<br />
              • Only Prepaid orders are accepted (NO COD).<br />
              • Ships within 1-3 working days.<br />
              • Delivers within 5-10 working days from the shipping date<br />
              <Link href="shipping policy link" target="_blank">For more info</Link>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Exchange & Return Policy</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              We perform strict quality checks before dispatch. Easy exchanges are allowed for damaged or defective products only.<br />
              <Link href="exchange policy link" target="_blank">For more info</Link>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};
