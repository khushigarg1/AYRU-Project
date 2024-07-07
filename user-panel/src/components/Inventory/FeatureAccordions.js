import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Link, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const FeatureAccordions = ({ product }) => {
  return (
    <Box>
      {/* Disclaimer Accordion */}
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Disclaimer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{product.disclaimer || "No disclaimer available"}</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Product Details Accordion */}
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Product Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#FFF8DC' }}>Style</TableCell>
                  <TableCell>{product.style || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#FFF8DC' }}>Pattern</TableCell>
                  <TableCell>{product.pattern || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#FFF8DC' }}>Fabric</TableCell>
                  <TableCell>{product.fabric || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#FFF8DC' }}>Size</TableCell>
                  <TableCell>{product.size || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#FFF8DC' }}>Item Weight</TableCell>
                  <TableCell>{product.weight || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#FFF8DC' }}>Thread Count</TableCell>
                  <TableCell>{product.threadCount || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#FFF8DC', width: "40%" }}>Origin</TableCell>
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

      {/* Shipping Policy Accordion */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Shipping Policy</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem sx={{ padding: '0' }}><ListItemText primary="• Free Shipping within INDIA" /></ListItem>
            <ListItem sx={{ padding: '0' }}><ListItemText primary="• Only Prepaid orders are accepted (NO COD)." /></ListItem>
            <ListItem sx={{ padding: '0' }}><ListItemText primary="• Ships within 1-3 working days." /></ListItem>
            <ListItem sx={{ padding: '0' }}><ListItemText primary="• Delivers within 5-10 working days from the shipping date" /></ListItem>
            <ListItem sx={{ padding: '0' }}>
              <Link href="shipping policy link" target="_blank">For more info</Link>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Exchange & Return Policy Accordion */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Exchange & Return Policy</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem sx={{ padding: '0' }}><ListItemText primary="• We perform strict quality checks before dispatch." /></ListItem>
            <ListItem sx={{ padding: '0' }}><ListItemText primary="• Easy exchanges are allowed for damaged or defective products only." /></ListItem>
            <ListItem sx={{ padding: '0' }}>
              <Link href="exchange policy link" target="_blank">For more info</Link>
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
