import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Card, CardContent, CardMedia, Typography, useTheme, useMediaQuery, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./styles.css";

export const InventoryAccordion = ({ relatedInventories }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Accordion sx={{ marginTop: "0px", boxShadow: "none" }} defaultExpanded disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          marginTop: "0px",
          marginBottom: "0px",
          boxShadow: "none",
          minHeight: 0,
          paddingLeft: "1px"
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>You might also like</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "5px" }}>
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 2,
            paddingBottom: '10px',
            '::-webkit-scrollbar': { display: 'none' } // Hide scrollbar for webkit browsers
          }}
        >
          {relatedInventories.map((inventory, index) => (
            <Card
              key={inventory.id}
              onClick={() => window.location.href = `/shop/${inventory.id}`}
              sx={{
                height: "200px",
                padding: "0px",
                boxShadow: "none",
                border: "1px solid gray",
                // marginRight: "15px",
                width: isMobile ? "35%" : "20%",
                cursor: "pointer",
                flexShrink: 0
              }}
            >
              <CardMedia
                component="img"
                image={inventory.Media && inventory.Media.length > 0 ? `https://ayrujaipur.s3.amazonaws.com/${inventory.Media[0].url}` : '/fallback_image_url'}
                alt={inventory.productName}
                sx={{
                  objectFit: 'fit',
                  // objectFit: 'contain',
                  height: "130px",
                  width: "100%"
                }}
              />
              <CardContent sx={{ mt: 0, padding: "5px" }}>
                <Typography variant="body2" color={inventory?.colorVariation || 'black'} component="p"
                  style={{ textTransform: "capitalize" }}
                >
                  {inventory?.colorVariation}
                </Typography>
                {inventory.discountedPrice ? (
                  <Box sx={{ display: "flex", direction: "row", gap: 1, flexDirection: "row" }}>
                    <Typography variant="body2" sx={{ textDecoration: 'line-through', fontSize: "12px" }}>
                      ₹ {inventory?.sellingPrice}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "12px" }}>
                      ₹ {inventory?.discountedPrice}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body1" sx={{ fontSize: "12px" }}>
                    ₹ {inventory?.sellingPrice}
                  </Typography>
                )}
                <Typography variant='body2' sx={{ color: inventory?.extraOptionOutOfStock ? 'red' : 'green', fontSize: "12px" }}>
                  {inventory.extraOptionOutOfStock ? 'Out of Stock' : 'In Stock'}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
