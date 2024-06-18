"use client";

import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { THEME_ID, createTheme, styled, useTheme } from "@mui/material/styles";

import React from "react";
import { ThemeProvider } from "@emotion/react";
import PageNav from "../components/PageNav";
import { AuthProvider } from "../contexts/auth";
import Marquee from "@/components/marquee";

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
      main: "#FF8A65",
      light: "#FFAB91",
      dark: "#E64A19",
      contrastText: "#000000",
    },
    divider: "rgba(0,0,0,0.12)",
    background: {
      paper: "#FFF9C4",
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
  return (
    <html lang="en">
      <head>
        <title>Admin</title>
        <link rel="icon" href="/images/AppIcon.png" type="image/x-icon" />
      </head>
      <body>
        <ThemeProvider theme={{ [THEME_ID]: materialTheme }}>
          <AuthProvider>
            <Marquee text="Big Sale - Up to 50% off on selected items! | Free shipping on orders over $50 | New arrivals are here, check them out!" />
            <PageNav>
              {children}
            </PageNav>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
