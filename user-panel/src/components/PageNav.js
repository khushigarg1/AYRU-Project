"use client";

import React, { useEffect, useState } from "react";
import { useTheme, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import BedIcon from "@mui/icons-material/Bed";
import BedRoundedIcon from "@mui/icons-material/BedRounded";
import KingBed from "@mui/icons-material/KingBed";
import { Badge, Avatar, Collapse, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useAuth } from "../contexts/auth";
import LoginForm from "./LoginForm";
import Link from "next/link";
import { CancelRounded, Home, SearchSharp } from "@mui/icons-material";
// import AppBar from "./AppBar";
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: 0,
  borderRight: "none",
  [theme.breakpoints.up("sm")]: {
    width: 0,
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// const StyledAppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     marginLeft: drawerWidth,
//     // width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
//   height: "65px",
//   '&.scrolled': {
//     position: "fixed",
//     top: '0px',
//     backgroundColor: theme.palette.background.contrast
//   },
// }));

const StyledAppBar = styled(MuiAppBar)(({ theme }) => ({
  top: 0,
  // height: '65px',
  display: 'flex',
  justifyContent: 'center',
  boxShadow: 'none',
  transition: 'top 0.3s',
  '&.scrolled': {
    top: 0,
    position: "fixed",
    backgroundColor: theme.palette.background.contrast,
  },
  backgroundColor: "white",
  position: "sticky",
  zIndex: theme.zIndex.drawer + 1,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  zIndex: theme.zIndex.drawer + 2,
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function PageNav({ children }) {
  const { isAuthenticated, isLoading, logout, openTab, setOpenTab } = useAuth();
  const theme = useTheme();
  const [open, setOpen] = useState(isAuthenticated);
  const [nestedOpen, setNestedOpen] = useState(false);

  const handleNestedClick = () => {
    setNestedOpen(!nestedOpen);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const handleScroll = () => {
      const appBar = document.querySelector('#app-bar');
      if (window.scrollY > 50) {
        appBar.classList.add('scrolled');
      } else {
        appBar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <Box sx={{ display: "flex", padding: "0px", flexDirection: "column" }}>
      <CssBaseline />
      <StyledAppBar id="app-bar">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', overflow: "hidden" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            sx={{ marginRight: 2 }}
          >
            <SearchSharp />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, textAlign: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            AYRU JAIPUR
          </Typography>
          <IconButton color="inherit" sx={{ marginLeft: 'auto' }}>
            <Badge badgeContent={4} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={10} color="error">
              <FavoriteIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <CancelRounded />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List style={{ padding: "0px" }}>
          <Link href="/">
            <ListItem
              key={"Cycles"}
              onClick={() => setOpenTab("Cycles".toLowerCase())}
              disablePadding
              sx={{ display: "block" }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Home />
                </ListItemIcon>
                <ListItemText
                  primary={"Home"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link href="/category">
            <ListItem
              key={"Cycles"}
              onClick={() => setOpenTab("Cycles".toLowerCase())}
              disablePadding
              sx={{ display: "block" }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Categories"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
          <ListItemButton
            onClick={handleNestedClick}
            sx={{
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              pl: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <AspectRatioIcon />
            </ListItemIcon>
            <ListItemText primary="Size Type" sx={{ opacity: open ? 1 : 0 }} />
            {open && (nestedOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
          <Collapse in={nestedOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link href="/size-type/flat">
                <ListItemButton sx={{ pl: open ? 4 : 2.5, justifyContent: open ? "initial" : "center" }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <BedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Flat" sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>

              </Link>
              <Link href="/size-type/fitted">
                <ListItemButton sx={{ pl: open ? 4 : 2.5, justifyContent: open ? "initial" : "center" }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <BedRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Fitted" sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
              <Link href="/size-type/custom-fitted">
                <ListItemButton sx={{ pl: open ? 4 : 2.5, justifyContent: open ? "initial" : "center" }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <KingBed />
                  </ListItemIcon>
                  <ListItemText primary="Custom Fitted" sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
            </List>
          </Collapse>
          <Link href="/options">
            <ListItem
              key={"Options"}
              onClick={() => setOpenTab("Options".toLowerCase())}
              disablePadding
              sx={{ display: "block" }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Options"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <Divider />
        {open && (
          <ListItem
            key={"Logout"}
            onClick={() => logout()}
            disablePadding
            sx={{ display: "block" }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Logout"}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 0, minHeight: "100vh" }}>
        {/* <DrawerHeader /> */}
        {children}
      </Box>
    </Box>
  );
}
