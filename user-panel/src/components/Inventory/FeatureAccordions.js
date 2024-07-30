import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Link, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import { WhatsappIcon } from 'next-share';

export const FeatureAccordions = ({ product }) => {
  const router = useRouter();
  const whatsappMessage = `Hi, I am interested in your Express shipping service.

Could you please provide me with the details regarding the process, any additional cost, and the estimated delivery time ? `;

  return (
    <Box>
      {/* Disclaimer Accordion */}
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{product.description || "No description available"}</Typography>
        </AccordionDetails>
      </Accordion>
      {/* Product Details Accordion */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Product Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#fcc73d' }}>Style</TableCell>
                  <TableCell>{product.style || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#fcc73d' }}>Pattern</TableCell>
                  <TableCell>{product.pattern || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#fcc73d' }}>Fabric</TableCell>
                  <TableCell>{product.fabric || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#fcc73d' }}>Size</TableCell>
                  <TableCell>{product.size || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#fcc73d' }}>Item Weight</TableCell>
                  <TableCell>{product.itemWeight || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#fcc73d' }}>Thread Count</TableCell>
                  <TableCell>{product.threadCount || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#fcc73d', width: "40%" }}>Origin</TableCell>
                  <TableCell>{product.origin || "N/A"}</TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell>Others</TableCell>
                  <TableCell>{product.others || "N/A"}</TableCell>
                </TableRow> */}
              </TableBody>
            </Table>

            <List sx={{ padding: "2px 10px" }}>
              {product.includedItems?.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bolder" }} >Included Items:</Typography>
                  <List dense>
                    {product.includedItems.map((item, index) => (
                      <ListItem key={index} sx={{ padding: '0' }}>
                        <ListItemText primary={`• ${item}`} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              {product.itemDimensions?.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bolder" }}>Item Dimensions:</Typography>
                  <List dense>
                    {product.itemDimensions.map((dimension, index) => (
                      <ListItem key={index} sx={{ padding: '0' }}>
                        <ListItemText primary={`• ${dimension}`} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              {product.specialFeatures?.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bolder" }}>Special Features:</Typography>
                  <List dense>
                    {product.specialFeatures.map((feature, index) => (
                      <ListItem key={index} sx={{ padding: '0' }}>
                        <ListItemText primary={`• ${feature}`} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              <Typography variant="subtitle1" sx={{ fontWeight: "bolder" }}>Others:</Typography>
              <ListItem>
                <ListItemText primary={product.others || "N/A"} />
              </ListItem>
            </List>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* Care Instructions Accordion */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Care Instructions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {product.careInstructions?.length > 0
              ? product.careInstructions.map((instruction, index) => (
                <ListItem key={index} sx={{ padding: '0' }}>
                  <ListItemText primary={`• ${instruction}`} />
                </ListItem>
              ))
              : <Typography>No instructions available</Typography>
            }
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Disclaimer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{product.disclaimer || "No disclaimer available"}</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Shipping Policy Accordion */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Shipping & Delivery</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem sx={{ padding: '0' }}><ListItemText primary="• Only Prepaid orders are accepted (NO COD)." /></ListItem>
            <ListItem sx={{ padding: '0' }}><ListItemText primary="• Standard Shipping FREE within INDIA" /></ListItem>
            <ListItem sx={{ padding: '0' }}><ListItemText primary="• Ships within 1-3 working days." /></ListItem>
            <ListItem sx={{ padding: '0' }}><ListItemText primary="• Delivers within 5-9 working days from the shipping date" /></ListItem>
            <ListItem sx={{ padding: '0' }}>
              <ListItemText
                primary={
                  `• To get Express Shipping (within 2-4 days), reach out to us on ` +
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
                  + ` after placing your order (additional charges will apply)`
                }
              />
            </ListItem>
            <ListItem sx={{ padding: '0', textDecoration: "underline", color: "#FFD54F", fontSize: "14px", cursor: "pointer" }} onClick={() => router.push("/policies/Shipping")}>
              For more details
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Exchange & Return Policy Accordion */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Exchange & Return</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem sx={{ padding: '0' }}><ListItemText primary="• We ensure strict quality checks before dispatch." /></ListItem>
            <ListItem sx={{ padding: '0' }}><ListItemText primary="• Exchanges are allowed for damaged or defective products only." /></ListItem>
            <ListItem sx={{ padding: '0', textDecoration: "underline", color: "#FFD54F", fontSize: "14px", cursor: "pointer" }} onClick={() => router.push("/policies/Exchange-refund")}>
              For more details
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
