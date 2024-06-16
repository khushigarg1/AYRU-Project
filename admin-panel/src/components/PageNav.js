"use client";

import { THEME_ID, createTheme, styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";
import CategoryIcon from '@mui/icons-material/Category';
import CategoryTwoToneIcon from '@mui/icons-material/CategoryTwoTone';
import SettingsIcon from "@mui/icons-material/Settings";
import React, { useState } from "react";
import { ThemeProvider } from "@emotion/react";
import { useAuth } from "../contexts/auth";
import { Avatar, Button, Collapse } from "@mui/material";
import LoginForm from "./LoginForm";
import Link from "next/link";
import { ColorLens, ExpandLess, ExpandMore, HeatPumpRounded, InventoryOutlined, KingBed, NightShelter, PersonPinCircleOutlined } from "@mui/icons-material";
import BedIcon from '@mui/icons-material/Bed';
import BedRoundedIcon from '@mui/icons-material/BedRounded';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

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
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  [theme.breakpoints.down("sm")]: {
    display: 'none',
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
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
  const [open, setOpen] = React.useState(isAuthenticated);
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
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open && isAuthenticated}>
        <Toolbar>
          {isAuthenticated && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          {/* <Image alt="logo" src="/images/logo.png"
          width={150}
          height={50}
          style={{right:"auto"}} /> */}
          {/* <Box sx={{display:"flex",width:"100%"}}>

          </Box> */}
          <Typography variant="h6" noWrap component="div">
            AYRU JAIPUR
          </Typography>
        </Toolbar>
      </AppBar>
      {isAuthenticated ? (
        <>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <>
                    <ChevronRightIcon />
                  </>
                ) : (
                  <>
                    {/* <Avatar alt="Remy Sharp" src="/images/logo.png" />
              <Button>LOGIN</Button> */}
                    <Typography variant="h6" noWrap component="div">
                      Admin Dashboard
                    </Typography>
                    <ChevronLeftIcon />
                  </>
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
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
              <Link href="/subcategory">
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
                      <CategoryTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Sub Categories"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link href="/color">
                <ListItem
                  key={"Colors"}
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
                      <ColorLens />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Colors"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link href="/size-type/chart">
                <ListItem
                  key={"SizeChart"}
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
                      <ColorLens />
                    </ListItemIcon>
                    <ListItemText
                      primary={"SizeChart"}
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
              <Link href="/client-love">
                <ListItem
                  key={"ClientLoves"}
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
                      <FavoriteIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Client Love"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link href="/inventory">
                <ListItem
                  key={"Inventory"}
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
                      <InventoryOutlined />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Inventory"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link href="/admin-details">
                <ListItem
                  key={"AdminDetails"}
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
                      <AccountBoxIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"AdminDetails"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
              <ListItem
                key={"Options"}
                onClick={() => setOpenTab("Options".toLowerCase())}
                disablePadding
                sx={{ display: "block" }}
              >
                <Link href="/options">
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
                </Link>
              </ListItem>

              {/* {["DashBoard", "Starred", "Send email", "Drafts"].map(
                (text, index) => (
                  <ListItem
                    key={text}
                    onClick={() => setOpenTab(text.toLowerCase())}
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
                        {index % 2 === 1 ? (
                          <InboxIcon />
                        ) : index == 0 ? (
                          <DashboardIcon />
                        ) : (
                          <MailIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={text}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem> */}
              {/* )
              )} */}
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
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />

            {children}
          </Box>
        </>
      ) : (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <LoginForm />
        </Box>
      )
      }
    </Box >
  );
}
