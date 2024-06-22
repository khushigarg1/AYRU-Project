import React, { useEffect } from "react";
import { AppBar as MuiAppBar, Toolbar, IconButton, Typography, Badge } from '@mui/material';
import { Menu as MenuIcon, SearchSharp, ShoppingCart as ShoppingCartIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(MuiAppBar)(({ theme }) => ({
  top: 0,
  height: '65px',
  display: 'flex',
  justifyContent: 'center',
  boxShadow: 'none',
  transition: 'top 0.3s',
  overflow: "hidden",
  backgroundColor: "white",
  '&.scrolled': {
    position: "fixed",
    top: '0px',
    backgroundColor: theme.palette.background.contrast
  },
}));

const AppBar = ({ open, isAuthenticated, handleDrawerOpen }) => {
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
    <StyledAppBar id="app-bar" position="sticky">
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
  );
};

export default AppBar;
