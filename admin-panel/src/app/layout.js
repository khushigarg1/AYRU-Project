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
import Head from "next/head";

const materialTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ff4081",
      light: "#f8bbd0",
      dark: "#f50057",
      contrastText: "#f5f5f5",
    },
    secondary: {
      main: "#fce4ec",
      dark: "#e57373",
      contrastText: '#000000',
    },
    divider: "rgba(0,0,0,0.24)",
    background: {
      paper: "#ffebee",
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


// const materialTheme = createTheme({
//   palette: {
//     mode: "light",
//     primary: {
//       main: "#e0e4f0", // Light calming blue
//       light: "#f2f5f8", // Lighter shade of primary for accents
//       dark: "#c7ced9", // Slightly darker shade of primary for depth
//       contrastText: "#000000", // Dark text for good contrast
//     },
//     secondary: {
//       main: "#f0e6d8", // Soft beige for warmth and texture
//       dark: "#d7ccc0", // Darker shade of secondary for accents
//       contrastText: "#000000", // Dark text for good contrast
//     },
//     error: {
//       main: "#f44336", // Red for error messages (optional)
//       contrastText: "#ffffff", // White text for clear visibility
//     },
//     divider: "rgba(0, 0, 0, 0.12)", // Light gray divider for subtle separation
//     background: {
//       paper: "#fff", // Clean white background
//     },
//     text: {
//       primary: "#333333", // Dark gray for main text
//       secondary: "#666666", // Lighter gray for secondary text
//     },
//   },
// });

// "use client";

// import "./globals.css";
// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/400.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";
// import { THEME_ID, createTheme } from "@mui/material/styles";
// import React from "react";
// import { ThemeProvider } from "@emotion/react";
// import PageNav from "../components/PageNav";
// import { AuthProvider } from "../contexts/auth";

// const materialTheme = createTheme({
//   palette: {
//     mode: "light",
//     primary: {
//       main: "#ff4081",
//       light: "#f8bbd0",
//       dark: "#f50057",
//       contrastText: "#f5f5f5",
//     },
//     secondary: {
//       main: "#fce4ec",
//       dark: "#e57373",
//       contrastText: "#000000",
//     },
//     divider: "rgba(0,0,0,0.24)",
//     background: {
//       paper: "#ffebee",
//     },
//   },
// });

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         <title>Admin</title>
//         <link rel="icon" href="/images/AppIcon.png" type="image/x-icon" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
//         {/* If you have other meta tags, stylesheets, or scripts, you can include them here */}
//       </head>
//       <body>
//         <ThemeProvider theme={{ [THEME_ID]: materialTheme }}>
//           <AuthProvider>
//             <PageNav>
//               {children}
//             </PageNav>
//           </AuthProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
