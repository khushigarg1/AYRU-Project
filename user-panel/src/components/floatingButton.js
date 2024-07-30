// FloatingWhatsAppButton.js
import React from 'react';
import { styled } from '@mui/system';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const FloatingButton = styled('a')({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  backgroundColor: '#25D366',
  color: 'white',
  borderRadius: '50%',
  width: '60px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  textDecoration: 'none',
  fontSize: '24px',
  zIndex: 1000,
  transition: 'background-color 0.3s, transform 0.3s',
  '&:hover': {
    backgroundColor: '#128C7E',
    transform: 'scale(1.1)',
  },
});

const FloatingWhatsAppButton = () => {
  const whatsappMessage = ``;

  return (
    <FloatingButton
      href={`https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon style={{ fontSize: '24px' }} />
    </FloatingButton>
  );
};

export default FloatingWhatsAppButton;
