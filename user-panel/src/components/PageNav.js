"use client";
import React, { useEffect, useRef, useState } from "react";
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
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { Badge, ListItemText, SvgIcon, useMediaQuery } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAuth } from "../contexts/auth";
import Link from "next/link";
import { AccountCircle, CancelRounded } from "@mui/icons-material";
import api from "../../api";
import logo from "../../public/images/logo.png"
import Image from "next/image";
import { useRouter } from "next/navigation";


const drawerWidth = 270;
const appBarHeight = 64;
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    // flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // marginTop: open ? `${appBarHeight}px` : "0",
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    fontFamily: theme.palette.typography.fontFamily
  })
);

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  fontFamily: theme.palette.typography.fontFamily
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
  fontFamily: theme.palette.typography.fontFamily
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  fontFamily: theme.palette.typography.fontFamily
}));

const StyledAppBar = styled(MuiAppBar)(({ theme }) => ({
  top: 0,
  display: 'flex',
  justifyContent: 'center',
  boxShadow: 'none',
  transition: 'top 0.3s',
  '&.scrolled': {
    top: 0,
    position: "fixed",
    backgroundColor: theme.palette.background.contrast,
  },
  '&.logoscroller': {
    backgroundColor: theme.palette.background.contrast,
  },
  backgroundColor: "white",
  position: "sticky",
  zIndex: theme.zIndex.drawer + 1,
  fontFamily: theme.palette.typography.fontFamily
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  zIndex: theme.zIndex.drawer + 2,
  fontWeight: "bold",
  fontSize: "20px",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
  fontFamily: theme.palette.typography.fontFamily
}));


const CustomListItemText = styled(ListItemText)(({ theme }) => ({
  fontSize: "20px",
  fontWeight: "bold",
}));

const CustomAccountIcon = (props) => (
  <SvgIcon {...props}>
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m12 4a5 5 0 1 1 -5 5 5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7 7 7 0 0 0 -7-7z" /><path d="m22 30h-2v-5a5 5 0 0 0 -5-5h-6a5 5 0 0 0 -5 5v5h-2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z" /><path d="m22 4h10v2h-10z" /><path d="m22 9h10v2h-10z" /><path d="m22 14h7v2h-7z" /><path d="m0 0h32v32h-32z" fill="none" /></svg>
  </SvgIcon>
);
const AuthenticatedSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.contrast,
  padding: theme.spacing(0),
  fontFamily: theme.palette.typography.fontFamily
}));

export default function PageNav({ children }) {

  const { isAuthenticated, isLoading, logout, openTab, setOpenTab, wishlistCount, cartCount, user, openAuthModal } = useAuth();
  const theme = useTheme();
  const [open, setOpen] = useState(isAuthenticated);
  const [categories, setCategories] = useState([]);
  const [scrolledstate, setScrolledstate] = useState(false);
  const router = useRouter();
  const drawerRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

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
      const logo = document.querySelector('#logo-img');
      if (window.scrollY > 50) {
        appBar.classList.add('scrolled');
        logo.classList.add('logoscroller');
        setScrolledstate(true);
      } else {
        appBar.classList.remove('scrolled');
        logo.classList.remove('logoscroller')
        setScrolledstate(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/visible');
      const sortedCategories = response.data.data.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
      setCategories(sortedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleClickCategory = (categoryId, hasSubcategories) => {
    if (hasSubcategories) {
      const updatedCategories = categories.map((category) => {
        if (category.id === categoryId) {
          return { ...category, open: !category.open };
        } else {
          return category;
        }
      });
      setCategories(updatedCategories);
    } else {
      // Navigate to specific path when there are no subcategories
      console.log("Navigate to specific path for category:", categoryId);
    }
  };

  const NestedList = ({ category }) => {
    const nestedOpen = category.open || false;

    return (
      <React.Fragment key={category.id}>
        <ListItem disablePadding sx={{ fontWeight: "bold" }} >
          <ListItemButton onClick={() => handleClickCategory(category.id, !!category.subcategories)} sx={{ fontWeight: "bold" }} >

            {category.subcategories.length === 0 ? (
              <Link onClick={handleDrawerClose} href={`/shop?categoryId=${category.id}`} passHref>
                <CustomListItemText primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "20px",
                }} primary={category.categoryName} sx={{ paddingLeft: "5px", fontWeight: "bold" }} />
              </Link>
            ) : (
              <>
                <CustomListItemText primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "20px",
                }} primary={category.categoryName} sx={{ paddingLeft: "5px", fontWeight: "bold" }} />
                {nestedOpen ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItemButton>
        </ListItem>
        <Collapse in={nestedOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ fontWeight: "bold" }} >
            {category.subcategories.map((subcategory) => (
              <ListItem
                key={subcategory.id}
                disablePadding
                sx={{ display: "block", fontWeight: "bolder" }}
              >
                <Link onClick={handleDrawerClose} href={`/shop?categoryId=${category.id}&subcategoryId=${subcategory.id}`} sx={{ fontWeight: "bold" }} >
                  <ListItemButton
                    onClick={() => handleClickCategory(category.id, false)}
                    sx={{ pl: 4, fontWeight: "bolder" }}
                  >
                    <CustomListItemText primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "20px",
                    }} sx={{ fontWeight: "bold" }} primary={subcategory.subcategoryName} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </React.Fragment>
    );
  };
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
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          {/* <Link onClick={handleDrawerClose} href={'/'} style={{ padding: "0px" }}> */}
          <Image component={Link} href={'/'} src={logo} alt="Logo" id="logo-img" width={110} height={40} style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            cursor: "pointer"
          }}
            onClick={() => router.push(`/`)}
          />
          {/* </Link> */}
          {/* <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, textAlign: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            AYRU JAIPUR
          </Typography> */}
          <IconButton component={Link} href={`/cart`} color="inherit" sx={{ marginLeft: 'auto', backgroundColor: "#d3d3d37a" }}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton component={Link} href={`/wishlist`} color="inherit" sx={{ marginLeft: "10px", backgroundColor: "#d3d3d37a" }}>
            <Badge badgeContent={wishlistCount} color="error">
              <FavoriteIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      <Drawer variant="permanent" open={open} ref={drawerRef}>
        {/* <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <CancelRounded />
          </IconButton>
        </DrawerHeader> */}

        {isAuthenticated ? (
          <AuthenticatedSection>
            <DrawerHeader>
              <Link onClick={handleDrawerClose} href="/setting">
                <Box display="flex" alignItems="center">
                  <CustomAccountIcon sx={{ marginLeft: 1, marginTop: 1 }} />
                </Box>
              </Link>
              <IconButton onClick={handleDrawerClose}>
                <CancelRounded />
              </IconButton>
            </DrawerHeader>
            <Link onClick={handleDrawerClose} href="/setting">
              <ListItem
                key={"setting"}
                onClick={() => setOpenTab("setting".toLowerCase())}
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
                  <CustomListItemText primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "20px",
                  }}
                    primary={user?.email}
                    // primary={"Account"}
                    sx={{
                      opacity: open ? 1 : 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  />
                  <ChevronRightIcon />
                </ListItemButton>
              </ListItem>
            </Link>
          </AuthenticatedSection>
        ) :
          <>
            <DrawerHeader>
              <Box display="flex" alignItems="center" onClick={openAuthModal} sx={{ cursor: "pointer" }}>
                <AccountCircle sx={{ marginLeft: 1, marginTop: 0 }} />Login
              </Box>
              <IconButton onClick={handleDrawerClose}>
                <CancelRounded />
              </IconButton>
            </DrawerHeader>
          </>
        }
        <Divider />
        <List style={{ padding: "0px" }}>
          <Link onClick={handleDrawerClose} href="/">
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
                <CustomListItemText primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "20px",
                }}
                  primary={"Home"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link onClick={handleDrawerClose} href="/shop">
            <ListItem
              key={"Shop"}
              onClick={() => setOpenTab("Shop".toLowerCase())}
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
                <CustomListItemText primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "20px",
                }}
                  primary={"Shop"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </Link>

          {categories.map((category) => (
            category.subcategories ? (
              <NestedList key={category.id} category={category} />
            ) : (
              <ListItem key={category.id} disablePadding>
                <ListItemButton onClick={() => handleClickCategory(category.id, false)}>
                  <CustomListItemText primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "20px",
                  }} primary={category.categoryName} sx={{ fontWeight: "bold" }} />
                </ListItemButton>
              </ListItem>
            )
          ))}

          <Link onClick={handleDrawerClose} href="/sale">
            <ListItem
              key={"sale"}
              onClick={() => setOpenTab("Sale".toLowerCase())}
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
                <CustomListItemText primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "20px",
                }}
                  primary={"SALE"}
                  sx={{ opacity: open ? 1 : 0, fontWeight: "bolder" }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
          <Divider />
          {isAuthenticated && (
            <>
              <Link onClick={handleDrawerClose} href="/orders">
                <ListItem
                  key={"orders"}
                  onClick={() => setOpenTab("orders".toLowerCase())}
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
                    <CustomListItemText primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "20px",
                    }}
                      primary={"My Orders"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link onClick={handleDrawerClose} href="/cart">
                <ListItem
                  key={"cart"}
                  onClick={() => setOpenTab("cart".toLowerCase())}
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
                    <CustomListItemText primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "20px",
                    }}
                      primary={"Cart"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link onClick={handleDrawerClose} href="/wishlist">
                <ListItem
                  key={"wishlist"}
                  onClick={() => setOpenTab("wishlist".toLowerCase())}
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
                    <CustomListItemText primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "20px",
                    }}
                      primary={"Wishlist"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            </>
          )}
          <Link onClick={handleDrawerClose} href="/about">
            <ListItem
              key={"about"}
              onClick={() => setOpenTab("about".toLowerCase())}
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
                <CustomListItemText primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "20px",
                }}
                  primary={"About Us"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <Divider />

        {isAuthenticated && (
          <>
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
                <CustomListItemText primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "20px",
                }}
                  primary={"Logout"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </Drawer>
      <Main component="main" sx={{
        flexGrow: 1,
        p: 0, marginTop: scrolledstate ? "58px" : "0px",
        transition: "margin-top 0.6s ease",
        paddingBottom: isMobile ? "0px" : "25px"
      }} mb={0}>
        {children}
      </Main>
    </Box >
  );
}
