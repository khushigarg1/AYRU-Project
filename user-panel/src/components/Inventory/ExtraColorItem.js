// import React from 'react';
// import { Accordion, AccordionSummary, AccordionDetails, Card, CardContent, CardMedia, Typography, useTheme, useMediaQuery, Box } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import "./styles.css";

// export const InventoryAccordion = ({ relatedInventories }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   return (
//     <Accordion sx={{ marginTop: "0px", boxShadow: "none" }} defaultExpanded disableGutters>
//       <AccordionSummary
//         expandIcon={<ExpandMoreIcon />}
//         sx={{
//           marginTop: "0px",
//           marginBottom: "0px",
//           boxShadow: "none",
//           minHeight: 0,
//           paddingLeft: "1px"
//         }}
//       >
//         <Typography sx={{ fontWeight: "bold" }}>You might also like</Typography>
//       </AccordionSummary>
//       <AccordionDetails sx={{ padding: "5px" }}>
//         <Box
//           sx={{
//             display: 'flex',
//             overflowX: 'auto',
//             gap: 1,
//             paddingBottom: '10px',
//             '::-webkit-scrollbar': { display: 'none' } // Hide scrollbar for webkit browsers
//           }}
//         >
//           {relatedInventories.map((inventory, index) => (
//             <Card
//               key={inventory.id}
//               onClick={() => window.location.href = `/shop/${inventory.id}`}
//               sx={{
//                 height: "200px",
//                 padding: "0px",
//                 boxShadow: "none",
//                 border: "1px solid gray",
//                 // marginRight: "15px",
//                 width: isMobile ? "35%" : "20%",
//                 cursor: "pointer",
//                 flexShrink: 0
//               }}
//             >
//               <CardMedia
//                 component="img"
//                 image={inventory.Media && inventory.Media.length > 0 ? `https://ayrujaipur.s3.amazonaws.com/${inventory.Media[0].url}` : '/fallback_image_url'}
//                 alt={inventory.productName}
//                 sx={{
//                   objectFit: 'fit',
//                   // objectFit: 'contain',
//                   height: "130px",
//                   width: "100%"
//                 }}
//               />
//               <CardContent sx={{ mt: 0, padding: "5px" }}>
//                 <Typography variant="body2" color={inventory?.colorVariation || 'black'} component="p"
//                   style={{
//                     textTransform: "capitalize", fontSize: "13px",
//                     letterSpacing: "-0.5px",
//                   }}
//                 >
//                   {inventory?.colorVariation}
//                 </Typography>
//                 {inventory.discountedPrice ? (
//                   <Box sx={{ display: "flex", direction: "row", gap: 1, flexDirection: "row" }}>
//                     <Typography variant="body2" sx={{ textDecoration: 'line-through', fontSize: "12px" }}>
//                       ₹ {inventory?.sellingPrice}
//                     </Typography>
//                     <Typography variant="body1" sx={{ fontSize: "12px" }}>
//                       ₹ {inventory?.discountedPrice}
//                     </Typography>
//                   </Box>
//                 ) : (
//                   <Typography variant="body1" sx={{ fontSize: "12px" }}>
//                     ₹ {inventory?.sellingPrice}
//                   </Typography>
//                 )}
//                 <Typography variant='body2' sx={{ color: inventory?.extraOptionOutOfStock ? 'red' : 'green', fontSize: "12px" }}>
//                   {inventory.extraOptionOutOfStock ? 'Out of Stock' : 'In Stock'}
//                 </Typography>
//               </CardContent>
//             </Card>
//           ))}
//         </Box>
//       </AccordionDetails>
//     </Accordion>
//   );
// };
import React, { useRef } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Card, CardContent, CardMedia, Typography, useTheme, useMediaQuery, Box, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "./styles.css";

export const InventoryAccordion = ({ relatedInventories }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
      <AccordionDetails sx={{ padding: "5px", display: 'flex', alignItems: 'center' }}>
        {!isMobile &&
          <IconButton onClick={() => handleScroll('left')}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '6px',
              transform: 'translateY(-50%)',
              zIndex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.4)", '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
              },
              color: "white",
              width: "30px",
              height: "30px",
              paddingLeft: "12px"
            }}>
            <ArrowBackIosIcon fontSize='10px' style={{ width: "15px", height: "15px" }} />
          </IconButton>
        }
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 1,
            paddingBottom: '10px',
            '::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for webkit browsers
            flexGrow: 1
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
                  height: "130px",
                  width: "100%"
                }}
              />
              <CardContent sx={{ mt: 0, padding: "5px" }}>
                <Typography variant="body2" color={inventory?.colorVariation || 'black'} component="p"
                  style={{
                    textTransform: "capitalize", fontSize: "13px",
                    letterSpacing: "-0.5px",
                  }}
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
        {!isMobile &&
          <IconButton onClick={() => handleScroll('right')}
            sx={{
              position: 'absolute',
              top: '50%',
              right: '6px',
              transform: 'translateY(-50%)',
              zIndex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
              },
              color: "white",
              width: "30px",
              height: "30px"
            }}>
            <ArrowForwardIosIcon fontSize='10px' style={{ width: "15px", height: "15px" }} />
          </IconButton>
        }
      </AccordionDetails>
    </Accordion>
  );
};
