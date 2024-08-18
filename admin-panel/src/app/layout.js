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

const materialTheme = createTheme({
  // palette: {
  //   mode: "light",
  //   primary: {
  //     main: "#ff4081",
  //     light: "#f8bbd0",
  //     dark: "#f50057",
  //     contrastText: "#f5f5f5",
  //   },
  //   secondary: {
  //     main: "#fce4ec",
  //     dark: "#e57373",
  //     contrastText: '#000000',
  //   },
  //   divider: "rgba(0,0,0,0.24)",
  //   background: {
  //     paper: "#ffebee",
  //   },
  // },
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
      primary: "#FFD54F",
      secondary: "#fcc73d",
      paper: "#FFF9C4",
      contrast: "#fcc73d"
    },
    typography: {
      fontFamily: "Neuton !important",
      fontFamily2: "Neuton, serif",
    }
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
        {/* <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <!-- If you have other meta tags, stylesheets, or scripts, you can include them here --> */}
        <title>Admin</title>
        <link rel="icon" href="/images/AppIcon.png" type="image/x-icon" />
      </head>
      <body>
        <ThemeProvider theme={{ [THEME_ID]: materialTheme }}>
          <AuthProvider>
            <PageNav>
              {/* <ProtectRoute> */}

              {children}
              {/* </ProtectRoute> */}

            </PageNav>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
