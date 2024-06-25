import React, { useState, useEffect } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import api from '../../../api';
import backgroundImage from "../../../public/images/blog3.webp";

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
        justifyContent: "center", alignItems: "center",
        textAlign: "center",
      }}>

        <Box>
          {firstMedia && (
            <Box>
              {firstMedia.imageUrl.endsWith('.mp4') ? (
                <video
                  controls
                  src={`${api.defaults.baseURL}image/${firstMedia.imageUrl}`}
                  style={{ maxWidth: '20em', maxHeight: '25em', borderRadius: '8px', marginBottom: '10px', backgroundColor: "transparent" }}
                />
              ) : (
                <img
                  src={`${api.defaults.baseURL}image/${firstMedia.imageUrl}`}
                  alt="First Media"
                  style={{ maxHeight: "25em", maxWidth: "20em", borderRadius: '8px', marginBottom: '10px' }}
                />
              )}
            </Box>
          )}
        </Box>
        <Box sx={{ width: "70%", margin: "0 auto", marginBottom: "4%", marginTop: "4%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Typography variant='h5' style={{ textAlign: "center", mb: 1 }}>
            BEDDING BY ALTAIRE HOMES
          </Typography>
          <Typography variant="body1" style={{ textAlign: "center" }}>
            Discover Altaire Homes, where comfort embraces luxury in a symphony of artistry. Handmade and block-printed, our home linens weave stories using the finest organic cotton. Timeless designs, bespoke to your heart's desire, elevate your haven to an artful sanctuary. Unwind in pure poetic elegance, cradled by our artisanal creations.
          </Typography>
        </Box>
        {!firstMedia && (
          <Typography variant="body1">No media found.</Typography>
        )}
      </Box>
    </Box>
  );
};
