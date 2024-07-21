// RootLayout.js
"use client";

import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { THEME_ID, createTheme, styled, useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@emotion/react";
import PageNav from "../components/PageNav";
import { AuthProvider } from "../contexts/auth";
import Marquee from "@/components/marquee";
import api from "../../api";
import Footer from "@/components/Footer";


const materialTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FFD54F",
      light: "#FFE082",
      dark: "#FFC107",
      contrastText: "#212121",
    },
    secondary: {
      main: "#fcc73d",
      light: "#FFAB91",
      dark: "#FFD54F",
      contrastText: "#000000",
    },
    text: {
      primary: "#212121",
      secondary: "#000000",
      text: "#fcc73d",
      font: "Montserrat, sans-serif",
      contrastText: "#212121",
    },
    divider: "rgba(0,0,0,0.12)",
    background: {
      // primary: "#fcc73d",
      primary: "#FFD54F",
      secondary: "#fcc73d",
      paper: "#FFF9C4",
      contrast: "#fcc73d"
    },
    typography: {
      fontFamily: "serif, sans-serif",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default function RootLayout({ children }) {
  const [marqueeText, setMarqueeText] = useState("");

  useEffect(() => {
    const fetchMarqueeText = async () => {
      try {
        const response = await api.get("/customer-side-data/1");
        setMarqueeText(response.data.data.marqueeText || '');
      } catch (error) {
        console.error("Error fetching marquee text:", error);
      }
    };

    fetchMarqueeText();
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Ayru Jaipur</title>
        <link rel="icon" href="/images/AppIcon.png" type="image/x-icon" />
      </head>
      <body style={{ width: "100%", padding: "0px", fontFamily: "sans-serif", overflowX: "hidden", marginLeft: 0, marginRight: 0 }}>
        <ThemeProvider theme={{ [THEME_ID]: materialTheme }}>
          <AuthProvider>
            <Marquee text={marqueeText} />
            <PageNav>
              {children}
            </PageNav>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
