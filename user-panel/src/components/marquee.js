import React, { useState, useEffect } from "react";
import { useTheme, styled } from "@mui/material/styles";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { useMediaQuery } from "@mui/material";
const MarqueeContainer = styled('div')(({ theme }) => ({
  // backgroundColor: "#FFD54F",
  backgroundColor: theme.palette.background.contrast,
  color: theme.palette.primary.contrastText,
  padding: "10px 2px",
  overflow: "hidden",
  // position: "fixed",
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
  fontFamily: theme.palette.typography.fontFamily,
  flex: 1,
  // textAlign: 'center',
  transition: "opacity 0.5s ease",
  whiteSpace: "normal",
  padding: "0px",
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const points = text.split('|').map(point => point.trim());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 7000);

    return () => clearInterval(interval);
  }, [currentIndex, points.length]);

  const handlePrev = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? points.length - 1 : prevIndex - 1));
      setFade(false);
    }, 7000);
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
        <MarqueeText style={{ opacity: fade ? 0 : 1, fontSize: isMobile ? "0.9em" : "1.2em" }}>
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