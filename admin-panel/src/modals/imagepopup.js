import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, useMediaQuery, IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { IMAGE_MODAL_STYLE, IMAGE_STYLE, CLOSE_ICON_STYLE } from '../styles/common';
import { ZoomIn, ZoomOut } from '@mui/icons-material';

const ImagePopup = ({ imageUrl, onClose }) => {
  console.log(imageUrl);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel((prevZoomLevel) => Math.min(prevZoomLevel + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => Math.max(prevZoomLevel - 0.1, 0.1));
  };

  return (
    <Modal
      open={Boolean(imageUrl)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      onClose={onClose}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <Box sx={{ ...IMAGE_MODAL_STYLE }}>
        <CloseIcon style={{ ...CLOSE_ICON_STYLE }} onClick={onClose} />
        <img
          src={imageUrl}
          alt='Selected Image'
          style={{
            ...IMAGE_STYLE,
            transform: `scale(${zoomLevel})`,
          }}
        />

        <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '10px', display: 'flex', justifyContent: 'space-between', width: '60px' }}>
          <IconButton onClick={handleZoomOut} style={{ color: 'white', backgroundColor: 'transparent', width: '30px', height: '30px' }}>
            <ZoomOut />
          </IconButton>
          <IconButton onClick={handleZoomIn} style={{ color: 'white', backgroundColor: 'transparent', width: '30px', height: '30px' }}>
            <ZoomIn />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};

ImagePopup.propTypes = {
  imageUrl: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default ImagePopup;
