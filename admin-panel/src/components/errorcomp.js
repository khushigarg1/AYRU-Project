// ErrorSnackbar.js
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ErrorSnackbar = ({ open, message, handleClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <SnackbarContent
        style={{
          backgroundColor: '#f44336',
          color: '#ffffff',
        }}
        message={"! " + message}
        // variant='filled'
        action={
          <IconButton size="small" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Snackbar>
  );
};

export default ErrorSnackbar;
