// "use client";
// import React from 'react';
// import { Grid, Button, useTheme } from '@mui/material';
// import { styled, keyframes } from '@mui/material/styles';
// import useRouter from '@/hooks/userouter';
// import Image from 'next/image';
// import image1 from "../../public/images/img1.jpeg";
// import image2 from "../../public/images/img2.jpeg";
// import image3 from "../../public/images/img3.jpeg";
// import image4 from "../../public/images/img4.jpeg";
// import image5 from "../../public/images/img5.jpeg";
// import image6 from "../../public/images/img5.jpeg";

// const fadeIn = keyframes`
//   from {
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;

// const ImageContainer = styled(Grid)(({ theme }) => ({
//   padding: '5px',
//   marginTop: '5px',
//   backgroundColor: theme.palette.background.paper,
//   borderRadius: '8px',
//   display: 'flex',
//   flexDirection: 'row',
//   flexWrap: 'wrap',
//   justifyContent: 'center',
//   gap: '10px',
// }));

// const ImageItem = styled('div')(({ theme }) => ({
//   position: 'relative',
//   width: 'calc(50% - 5px)',
//   paddingBottom: '80%',
//   animation: `${fadeIn} 0.5s ease-in-out`,
//   [theme.breakpoints.up('sm')]: {
//     width: 'calc(50% - 10px)',
//     paddingBottom: '50%',
//   },
//   [theme.breakpoints.up('md')]: {
//     width: 'calc(33.333% - 10px)',
//     paddingBottom: '33.333%',
//   },
// }));

// const OverlayButton = styled(Button)(({ theme }) => ({
//   position: 'absolute',
//   bottom: '40%',
//   left: '50%',
//   fontFamily: "serif",
//   fontSize: "0.7rem",
//   transform: 'translateX(-50%)',
//   backgroundColor: theme.palette.primary.main,
//   color: theme.palette.primary.contrastText,
//   '&:hover': {
//     backgroundColor: theme.palette.primary.dark,
//   },
// }));

// const images = [
//   { src: image1, alt: 'Bath Essentials', link: '/page1' },
//   { src: image2, alt: 'Dohar', link: '/page2' },
//   { src: image3, alt: 'Quilt', link: '/page3' },
//   { src: image4, alt: 'Bedsheet', link: '/page4' },
//   { src: image5, alt: 'Bedding', link: '/page5' },
//   { src: image6, alt: 'Bedding', link: '/page6' },
// ];

// const ImageGrid = () => {
//   const theme = useTheme();
//   const router = useRouter();

//   const handleButtonClick = (link) => {
//     router.push(link);
//   };

//   return (
//     <ImageContainer container>
//       {images.map((image, index) => (
//         <ImageItem key={index}>
//           <Image src={image.src} alt={image.alt} layout="fill" objectFit="cover" />
//           <OverlayButton onClick={() => handleButtonClick(image.link)}>{image.alt}</OverlayButton>
//         </ImageItem>
//       ))}
//     </ImageContainer>
//   );
// };

// export default ImageGrid;
"use client";
import React from 'react';
import { Grid, Button, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import useRouter from '@/hooks/userouter';
import Image from 'next/image';
import image1 from "../../public/images/img1.jpeg";
import image2 from "../../public/images/img2.jpeg";
import image3 from "../../public/images/img3.jpeg";
import image4 from "../../public/images/img4.jpeg";
import image5 from "../../public/images/img5.jpeg";
import image6 from "../../public/images/img5.jpeg";

const ImageContainer = styled(Grid)(({ theme }) => ({
  padding: '10px',
  marginTop: '5px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '10px',
}));

const ImageItem = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingBottom: '100%', // This makes the div a square
  [theme.breakpoints.up('sm')]: {
    width: 'calc(50% - 10px)',
  },
  [theme.breakpoints.up('md')]: {
    width: 'calc(33.333% - 10px)',
  },
}));

const OverlayButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: '40%',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));


const images = [
  { src: image1, alt: 'Bath Essentials', link: '/page1' },
  { src: image2, alt: 'Dohar', link: '/page2' },
  { src: image3, alt: 'Quilt', link: '/page3' },
  { src: image4, alt: 'Bedsheet', link: '/page4' },
  { src: image5, alt: 'Bedding', link: '/page5' },
  { src: image6, alt: 'Bedding', link: '/page6' },
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
        <ImageItem key={index}>
          <Image src={image.src} alt={image.alt} layout="fill" objectFit="cover" />
          <OverlayButton onClick={() => handleButtonClick(image.link)}>{image.alt}</OverlayButton>
        </ImageItem>
      ))}
    </ImageContainer>
  );
};

export default ImageGrid;
