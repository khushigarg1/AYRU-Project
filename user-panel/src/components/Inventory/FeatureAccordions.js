import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Link, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import { WhatsappIcon } from 'next-share';

export const FeatureAccordions = ({ product }) => {
  const router = useRouter();
  const theme = useTheme();
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
          <Typography variant='subtitle1' sx={{ fontWeight: "200", lineHeight: 1.2 }}>{product.description || "No description available"}</Typography>
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
              <TableBody sx={{ fontFamily: theme.palette.typography.fontFamily }}>
                {product?.style &&
                  <TableRow sx={{ fontFamily: theme.palette.typography.fontFamily }}>
                    <TableCell sx={{ backgroundColor: '#fcc73d', width: "40%", fontWeight: "bolder", fontSize: "16px", fontFamily: theme.palette.typography.fontFamily }}>Style</TableCell>
                    <TableCell sx={{ fontSize: "15px", fontFamily: theme.palette.typography.fontFamily }}>{product.style || "N/A"}</TableCell>
                  </TableRow>
                }
                {product?.pattern &&

                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#fcc73d', width: "40%", fontWeight: "bolder", fontSize: "16px", fontFamily: theme.palette.typography.fontFamily }}>Pattern</TableCell>
                    <TableCell sx={{ fontSize: "15px", fontFamily: theme.palette.typography.fontFamily }}>{product.pattern || "N/A"}</TableCell>
                  </TableRow>
                }
                {product?.fabric &&

                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#fcc73d', width: "40%", fontWeight: "bolder", fontSize: "16px", fontFamily: theme.palette.typography.fontFamily }}>Fabric</TableCell>
                    <TableCell sx={{ fontSize: "15px", fontFamily: theme.palette.typography.fontFamily }}>{product.fabric || "N/A"}</TableCell>
                  </TableRow>
                }
                {product?.size &&

                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#fcc73d', width: "40%", fontWeight: "bolder", fontSize: "16px", fontFamily: theme.palette.typography.fontFamily }}>Size</TableCell>
                    <TableCell sx={{ fontSize: "15px", fontFamily: theme.palette.typography.fontFamily }}>{product.size || "N/A"}</TableCell>
                  </TableRow>
                }
                {product?.itemWeight &&
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#fcc73d', width: "40%", fontWeight: "bolder", fontSize: "16px", fontFamily: theme.palette.typography.fontFamily }}>Item Weight</TableCell>
                    <TableCell sx={{ fontSize: "15px", fontFamily: theme.palette.typography.fontFamily }}>{product.itemWeight + " KG" || "N/A"}</TableCell>
                  </TableRow>
                }
                {product?.threadCount &&
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#fcc73d', width: "40%", fontWeight: "bolder", fontSize: "16px", fontFamily: theme.palette.typography.fontFamily }}>Thread Count</TableCell>
                    <TableCell sx={{ fontSize: "15px", fontFamily: theme.palette.typography.fontFamily }}>{product.threadCount || "N/A"}</TableCell>
                  </TableRow>
                }
                {product?.origin &&
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#fcc73d', width: "40%", fontWeight: "bolder", fontSize: "16px", fontFamily: theme.palette.typography.fontFamily }}>Origin</TableCell>
                    <TableCell sx={{ fontSize: "15px", fontFamily: theme.palette.typography.fontFamily }}>{product.origin || "N/A"}</TableCell>
                  </TableRow>
                }
                {/* <TableRow>
                  <TableCell>Others</TableCell>
                  <TableCell>{product.others || "N/A"}</TableCell>
                </TableRow> */}
              </TableBody>
            </Table>

            <List sx={{ padding: "0px", paddingTop: "15px" }} mt={2}>
              {product.includedItems?.length > 0 && (
                <>
                  <Typography variant="body1" sx={{ fontWeight: "bolder", fontSize: "16px", fontFamily: theme.palette.typography.fontFamily }} >Included Items:</Typography>
                  <List dense sx={{ fontWeight: "500", fontSize: "16px" }}>
                    {product.includedItems.map((item, index) => (
                      <ListItem key={index} sx={{ padding: '0' }}>
                        <ListItemText sx={{ fontWeight: "500", fontSize: "16px" }} primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: "16px",
                        }} primary={`• ${item}`} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              {product.itemDimensions?.length > 0 && (
                <>
                  <Typography variant="body1" sx={{ fontWeight: "bolder", fontSize: "16px", fontFamily: theme.palette.typography.fontFamily }}>Item Dimensions:</Typography>
                  <List dense>
                    {product.itemDimensions.map((dimension, index) => (
                      <ListItem key={index} sx={{ padding: '0' }}>
                        <ListItemText sx={{ fontWeight: "500px", fontSize: "16px" }} primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: "16px",
                        }} primary={`• ${dimension}`} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              {product.specialFeatures?.length > 0 && (
                <>
                  <Typography variant="body1" sx={{ fontWeight: "bolder", fontSize: "16px", fontFamily: theme.palette.typography.fontFamily }}>Special Features:</Typography>
                  <List dense>
                    {product.specialFeatures.map((feature, index) => (
                      <ListItem key={index} sx={{ padding: '0' }}>
                        <ListItemText sx={{ fontWeight: "500px", fontSize: "16px" }} primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: "16px",
                        }} primary={`• ${feature}`} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              {product?.others &&
                <>
                  <Typography variant="body1" sx={{ fontWeight: "bolder", fontSize: "16px", fontFamily: theme.palette.typography.fontFamily }}>Others:</Typography>
                  <ListItem>
                    <ListItemText sx={{ lineHeight: 1.2, fontWeight: "500px", fontSize: "16px" }} primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "16px",
                    }} primary={product.others || "N/A"} />
                  </ListItem>
                </>
              }
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
                  <ListItemText sx={{ fontWeight: "500px", fontSize: "16px" }} primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "16px",
                  }} variant='subtitle1' primary={`• ${instruction}`} />
                </ListItem>
              ))
              : <Typography variant='subtitle1' >No instructions available</Typography>
            }
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Disclaimer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant='subtitle1' sx={{ lineHeight: 1.2 }} >{product.disclaimer || "No disclaimer available"}</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Shipping Policy Accordion */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Shipping & Delivery</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense variant='subtitle1' >
            <ListItem sx={{
              padding: '0',
              fontSize: "16px"
            }}><ListItemText primaryTypographyProps={{
              fontWeight: 500,
              fontSize: "16px",
            }} primary="• Only Prepaid orders are accepted (NO COD)." /></ListItem>
            <ListItem sx={{
              padding: '0',
              fontSize: "16px"
            }}><ListItemText primaryTypographyProps={{
              fontWeight: 500,
              fontSize: "16px",
            }} primary="• Standard Shipping FREE within INDIA" /></ListItem>
            <ListItem sx={{
              padding: '0',
              fontSize: "16px"
            }}><ListItemText primaryTypographyProps={{
              fontWeight: 500,
              fontSize: "16px",
            }} primary="• Ships within 1-3 working days." /></ListItem>
            <ListItem sx={{
              padding: '0',
              fontSize: "16px"
            }}><ListItemText primaryTypographyProps={{
              fontWeight: 500,
              fontSize: "16px",
            }} primary="• Delivers within 5-9 working days from the shipping date" /></ListItem>
            <ListItem sx={{ padding: '0' }}>
              <ListItemText
                sx={{ fontWeight: "500px", fontSize: "16px" }}
                primary={
                  <>
                    • To get Express Shipping (within 2-4 days), reach out to us on{" "}
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
                    </Button>{" "}
                    after placing your order (additional charges will apply)
                  </>
                }
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "16px",
                }}
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
          <List dense variant='subtitle1' >
            <ListItem sx={{
              padding: '0',
              fontSize: "16px"
            }}>
              <ListItemText primaryTypographyProps={{
                fontWeight: 500,
                fontSize: "16px",
              }} primary="• We ensure strict quality checks before dispatch." />
            </ListItem>
            <ListItem sx={{
              padding: '0',
              fontSize: "16px"
            }}>
              <ListItemText primaryTypographyProps={{
                fontWeight: 500,
                fontSize: "16px",
              }} primary="• Exchanges are allowed for damaged or defective products only." />
            </ListItem>
            <ListItem sx={{ padding: '0', textDecoration: "underline", color: "#FFD54F", fontSize: "14px", cursor: "pointer" }} onClick={() => router.push("/policies/Exchange-refund")}>
              For more details
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
