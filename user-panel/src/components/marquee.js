import React from "react";
import { useTheme, styled } from "@mui/material/styles";

const MarqueeContainer = styled('div')(({ theme }) => ({
  backgroundColor: "#f8b408",
  color: theme.palette.primary.contrastText,
  padding: "10px 0",
  overflow: "hidden",
  whiteSpace: "nowrap",
  position: "relative",
}));

const MarqueeText = styled('div')({
  display: "inline-block",
  paddingLeft: "100%", // Start the text from the right side
  animation: "marquee 10s linear infinite", // Adjust timing to your needs
  "@keyframes marquee": {
    "0%": { transform: "translateX(0)" },
    "100%": { transform: "translateX(-100%)" },
  },
});

const Marquee = ({ text }) => {
  const theme = useTheme();

  return (
    <MarqueeContainer theme={theme}>
      <MarqueeText>{text}</MarqueeText>
      <MarqueeText>{text}</MarqueeText>
    </MarqueeContainer>
  );
};

export default Marquee;
