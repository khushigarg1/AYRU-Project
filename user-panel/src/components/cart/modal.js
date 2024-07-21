import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton, Button, Divider } from '@mui/material';
import { DeleteForever, Close } from '@mui/icons-material';

const ConfirmModal = ({ open, handleClose, handleRemove, handleAddToWishlist }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 4, right: 4 }}>
          <Close />
        </IconButton>
        <Typography variant="h6" component="h2">
          Are you sure you want to delete this item?
        </Typography>
        <Divider />
        <Box sx={{ mt: 2 }}>
          <Button
            variant="ghost"
            color="secondary"
            onClick={handleAddToWishlist}
            sx={{ mr: 2 }}
          >
            Add to Wishlist
          </Button>
          <Button
            variant="ghost"
            color="secondary"
            onClick={handleRemove}
            sx={{ mr: 2 }}
          >
            Remove
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default ConfirmModal;
