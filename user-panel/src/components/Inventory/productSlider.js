import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { Box, CardMedia, useMediaQuery, useTheme } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductSlider = ({ media }) => {
  const slider1Ref = useRef(null);
  const slider2Ref = useRef(null);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const itemsPerPage = isMobile ? 2 : 5;

  useEffect(() => {
    setNav1(slider1Ref.current);
    setNav2(slider2Ref.current);
  }, [media]);

  const mainSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: nav2,
    arrows: true,
  };

  const thumbnailSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: itemsPerPage,
    slidesToScroll: itemsPerPage,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
    ],
    appendDots: dots => (
      <Box sx={{ display: 'flex', justifyContent: 'center', listStyle: 'none', p: 0, m: 0 }}>
        {dots}
      </Box>
    ),
    customPaging: i => (
      <Box
        component="div"
        sx={{
          width: '10px',
          height: '10px',
          backgroundColor: '#000',
          borderRadius: '50%',
          display: 'inline-block',
          margin: '0 5px',
        }}
      ></Box>
    ),
  };

  return (
    <Box>
      <Slider {...mainSliderSettings} ref={slider1Ref}>
        {media.map((item) => (
          <Box key={item.id}>
            <CardMedia
              component="img"
              image={`https://ayru-jaipur.s3.amazonaws.com/${item.url}`}
              alt={item.alt}
              height={550}
              style={{ objectFit: "cover" }}
            />
          </Box>
        ))}
      </Slider>
      <Slider {...thumbnailSliderSettings} ref={slider2Ref}>
        {media.map((item) => (
          <Box key={item.id} sx={{ p: 1 }}>
            <CardMedia
              component="img"
              image={`https://ayru-jaipur.s3.amazonaws.com/${item.url}`}
              alt={item.alt}
              height={80}
              style={{ objectFit: "cover", cursor: "pointer" }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default ProductSlider;
