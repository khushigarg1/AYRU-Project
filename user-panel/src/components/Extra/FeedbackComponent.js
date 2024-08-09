import React, { useState, useEffect } from 'react';
import { Box, Typography, useMediaQuery, useTheme, Paper } from '@mui/material';
import api from '../../../api';
import backgroundImage from "../../../public/images/blog6.webp";
import WebpImage from '../../../public/images/blog6.webp';
import StarIcon from '@mui/icons-material/Star';
import PriceTag from "../../../public/images/pricetag.png";
import Image from 'next/image';

export const FeedbackComponent = () => {
  const [firstMedia, setFirstMedia] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchFirstMedia();
  }, []);

  const fetchFirstMedia = async () => {
    const type = "secondary";
    try {
      const response = await api.get('/customer-side-data/media', {
        params: { type },
      });
      const mediaData = response.data.data;
      const firstMediaItem = mediaData.find(media => media.imageUrl && (media.imageUrl.endsWith('.jpg') || media.imageUrl.endsWith('.png') || media.imageUrl.endsWith('.mp4')));

      setFirstMedia(firstMediaItem);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', paddingX: "50px", justifyContent: 'center', marginTop: 1, position: 'relative', width: '100%', backgroundColor: theme.palette.background.paper }}>
        <Image src={backgroundImage} alt="Left Image" width={100} height={100} style={{ position: 'absolute', left: '-8px', top: isMobile ? "75%" : "65%", transform: 'translateY(-50%)', maxWidth: '20%', height: 'auto' }} />
        <Paper sx={{ padding: 2, textAlign: 'center', maxWidth: '800px', boxShadow: "none", fontFamily: theme.palette.typography.fontFamily }}>
          <Image src={PriceTag} alt="Premium Quality" width={50} height={50} style={{ maxWidth: '60%', height: 'auto', margin: 'auto', marginBottom: "10px" }} />
          <Typography variant="h6" gutterBottom={!isMobile}>
            Unbeatable Price
          </Typography>
          <Typography variant="subtitle1" style={{ fontSize: "90%" }}>
            We offer top quality products at most affordable prices, providing the best value for your money.
          </Typography>
        </Paper>
        <Image src={backgroundImage} alt="Right Image" width={100} height={100} style={{ position: 'absolute', right: '-8px', top: isMobile ? "75%" : "65%", transform: 'translateY(-50%)', maxWidth: '20%', height: 'auto' }} />
      </Box>
      <Box sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "center", alignItems: "center",
        textAlign: "center",
        mt: 4
      }}>
        <Box sx={{
          width: isMobile ? "100%" : "70%", marginBottom: "4%", display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: !isMobile && 5,
          justifyContent: "center", alignItems: "center",
          textAlign: "center",
        }}>

          <Box>
            {firstMedia && (
              <Box>
                {firstMedia.imageUrl.endsWith('.mp4') ? (
                  <>
                    <video
                      controls
                      src={`https://ayrujaipur.s3.amazonaws.com/${firstMedia.imageUrl}`}
                      style={{ maxWidth: '20em', maxHeight: '25em', borderRadius: '8px', marginBottom: '10px', backgroundColor: "transparent" }}
                      autoPlay
                    />
                  </>
                ) : (
                  <img
                    src={`https://ayrujaipur.s3.amazonaws.com/${firstMedia.imageUrl}`}
                    alt="First Media"
                    style={{ maxHeight: "25em", maxWidth: "20em", borderRadius: '8px', marginBottom: '10px' }}
                  />
                )}
              </Box>
            )}
          </Box>
          <Box sx={{ width: "80%", margin: "0 auto", marginBottom: "4%", marginTop: "4%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Typography variant='h5' style={{ textAlign: "center", mb: 1, fontWeight: "bold" }} mb={1}>
              FROM JAIPUR STREETS TO YOUR HOME
            </Typography>
            <Typography variant="subtitle1" style={{ textAlign: "center" }}>
              The Journey of AYRU JAIPUR began in 2020 during the challenging times of COVID-19, and we are proud to be rooted exclusively in Jaipur, a city we fall more in love with each day. Drawing inspiration from the everyday happiness found in Jaipur’s vibrant streets, rich colors, intricate patterns, and lively sounds, we create interwoven stories and styles that define our unique aesthetic.
              We are committed to supporting artisan livelihoods and maintaining exceptional quality in all our products.
            </Typography>
          </Box>
          {!firstMedia && (
            <Typography variant="body1">No media found.</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};