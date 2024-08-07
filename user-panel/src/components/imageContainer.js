"use client";
import React from 'react';
import { Grid, Button, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import useRouter from '@/hooks/userouter';
import Image from 'next/image';
import image1 from "../../public/images/img1.jpeg";
import image2 from "../../public/images/img2.jpeg";
import image3 from "../../public/images/img3.jpeg";
import image4 from "../../public/images/img4.jpeg";
import image5 from "../../public/images/img5.jpeg";
import image6 from "../../public/images/img6.jpeg";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideFromBottom = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const slideFromTop = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;
const ImageContainer = styled(Grid)(({ theme }) => ({
  padding: '5px',
  marginTop: '5px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '10px',
}));

const ImageItem = styled('div')(({ theme, index }) => ({
  position: 'relative',
  width: 'calc(50% - 5px)',
  paddingBottom: '70%',
  // animation: `${fadeIn} 0.5s ease-in-out`,
  // animation: `${index % 2 === 0 ? fadeInLeft : fadeInRight} 0.9s ease-in-out`,
  animation: `${index % 2 === 0 ? slideFromBottom : slideFromTop} 0.5s ease-in-out`,

  [theme.breakpoints.up('sm')]: {
    width: 'calc(50% - 10px)',
    paddingBottom: '50%',
  },
  [theme.breakpoints.up('md')]: {
    width: 'calc(33.333% - 10px)',
    paddingBottom: '33.333%',
  },
}));

const OverlayButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: '10%',
  left: '50%',
  fontFamily: theme.palette.typography.fontFamily,
  fontSize: "0.7rem",
  transform: 'translateX(-50%)',
  minWidth: "142px",
  backgroundColor: theme.palette.background.contrast,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    // backgroundColor: theme.palette.primary.dark,
  },
}));

const images = [
  { src: image4, alt: 'BEDSHEET', link: '/shop?categoryId=1' },
  { src: image6, alt: 'BEDDING SET', link: '/shop?categoryId=2' },
  { src: image3, alt: 'QUILT', link: '/shop?categoryId=3' },
  { src: image2, alt: 'DOHAR', link: '/shop?categoryId=4' },
  { src: image5, alt: 'BEDCOVER', link: '/shop?categoryId=5' },
  { src: image1, alt: 'BATH ESSENTIALS', link: '/shop?categoryId=6' },
];

const ImageGrid = () => {
  const theme = useTheme();
  const router = useRouter();

  const handleButtonClick = (link) => {
    router.push(link);
  };

  return (
    <ImageContainer container>
      {images.map((image, index) => (
        <ImageItem key={index} index={index} onClick={() => handleButtonClick(image.link)}>
          <Image src={image.src} alt={image.alt} layout="fill" objectFit="cover" />
          <OverlayButton >{image.alt}</OverlayButton>
        </ImageItem>
      ))}
    </ImageContainer>
  );
};

export default ImageGrid;
