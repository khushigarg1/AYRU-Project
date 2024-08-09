import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Card, CardContent, CardMedia, Typography, useTheme, useMediaQuery, Divider, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import "./styles.css";

export const InventoryAccordion = ({ relatedInventories }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 3 : 4,
    slidesToScroll: 2,
    arrows: false
  };

  return (
    <Accordion sx={{ marginTop: "0px", boxShadow: "none" }} defaultExpanded disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          marginTop: "0px", // Adjust margin top
          marginBottom: "0px", // Adjust margin bottom
          boxShadow: "none",
          minHeight: 0,
          paddingLeft: "1px"
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>You might also like</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "5px" }}>
        <Slider {...settings}>
          {relatedInventories.map((inventory, index) => (
            <Card key={inventory.id}
              onClick={() => window.location.href = `/shop/${inventory.id}`} sx={{
                height: "220px", padding: "0px 0px", boxShadow: "none", border: "1px solid black", marginRight: "15px", width: "90%", cursor: "pointer"
              }}>
              <CardMedia
                component="img"
                image={inventory.Media && inventory.Media.length > 0 ? `https://ayrujaipur.s3.amazonaws.com/${inventory.Media[0].url}` : '/fallback_image_url'}
                alt={inventory.productName}
                sx={{
                  objectFit: 'contain',
                  height: "150px",
                  width: "100%"
                }}
              />
              {/* <Divider sx={{ borderStyle: "dotted", mt: 1 }} /> */}
              <CardContent sx={{ mt: 0, padding: "5px" }}>
                <Typography variant="body2" color="textSecondary" component="p">
                  {inventory.colorVariation}
                </Typography>
                {inventory.discountedPrice ? (
                  <Box sx={{ gap: 1 }}>
                    <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                      ₹ {inventory?.sellingPrice?.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" >
                      ₹ {inventory?.discountedPrice?.toFixed(2)}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2">
                    ₹ {inventory?.sellingPrice?.toFixed(2)}
                  </Typography>
                )}
                <Typography variant='body2' sx={{ color: inventory?.extraOptionOutOfStock ? 'red' : 'green' }}>
                  {inventory.extraOptionOutOfStock ? 'Out of Stock' : 'In Stock'}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Slider>
      </AccordionDetails>
    </Accordion>
  );
};

