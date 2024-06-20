// import React from "react";
// import { useTheme, styled } from "@mui/material/styles";

// const MarqueeContainer = styled('div')(({ theme }) => ({
//   backgroundColor: "#f8b408",
//   color: theme.palette.primary.contrastText,
//   padding: "10px 0",
//   overflow: "hidden",
//   whiteSpace: "nowrap",
//   position: "relative",
// }));

// const MarqueeText = styled('div')({
//   display: "inline-block",
//   paddingLeft: "100%", // Start the text from the right side
//   animation: "marquee 10s linear infinite", // Adjust timing to your needs
//   "@keyframes marquee": {
//     "0%": { transform: "translateX(0)" },
//     "100%": { transform: "translateX(-100%)" },
//   },
// });

// const Marquee = ({ text }) => {
//   const theme = useTheme();

//   return (
//     <MarqueeContainer theme={theme}>
//       <MarqueeText>{text}</MarqueeText>
//       <MarqueeText>{text}</MarqueeText>
//     </MarqueeContainer>
//   );
// };

// export default Marquee;
import React, { useState, useEffect } from "react";
import { useTheme, styled } from "@mui/material/styles";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
const MarqueeContainer = styled('div')(({ theme }) => ({
  backgroundColor: "#f8b408",
  color: theme.palette.primary.contrastText,
  padding: "10px 2px",
  overflow: "hidden",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 1000,
  height: "50px"
}));

const MarqueeText = styled('div')(({ theme }) => ({
  fontFamily: 'serif',
  flex: 1,
  textAlign: 'center',
  transition: "opacity 0.5s ease",
  whiteSpace: "normal",
  padding: "0px",
  fontSize: "1rem",
  maxHeight: "2.4rem",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 1,
}));

const HiddenMarqueeText = styled(MarqueeText)({
  fontFamily: 'serif',
  opacity: 0,
  position: 'absolute',
  left: 0,
  right: 0,
});

const NavButton = styled('button')(({ theme }) => ({
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: theme.palette.primary.contrastText,
  padding: '0 3px',
  '&:focus': {
    outline: 'none',
  },
}));

const Marquee = ({ text }) => {
  const theme = useTheme();
  const points = text.split('|').map(point => point.trim());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, points.length]);

  const handlePrev = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? points.length - 1 : prevIndex - 1));
      setFade(false);
    }, 5000);
  };

  const handleNext = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === points.length - 1 ? 0 : prevIndex + 1));
      setFade(false);
    }, 500);
  };

  return (
    <MarqueeContainer theme={theme} style={{ padding: "5px 1px" }}>
      <NavButton onClick={handlePrev}>
        <ChevronLeftIcon />
      </NavButton>
      <div style={{ position: 'relative', flex: 1, padding: "0" }}>
        <HiddenMarqueeText>{points[(currentIndex - 1 + points.length) % points.length]}</HiddenMarqueeText>
        <MarqueeText style={{ opacity: fade ? 0 : 1 }}>
          {points[currentIndex]}
        </MarqueeText>
        <HiddenMarqueeText>{points[(currentIndex + 1) % points.length]}</HiddenMarqueeText>
      </div>
      <NavButton onClick={handleNext}>
        <ChevronRightIcon />
      </NavButton>
    </MarqueeContainer>
  );
};

export default Marquee;

// Usage example
// <Marquee text="Big Sale - Up to 50% off on selected items! | Free shipping on orders over $50 | New arrivals are here, check them out" />
