import zIndex from "@mui/material/styles/zIndex";

// Modal Style UI
export const MODALSTYLE = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '80%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 3,
  backgroundColor: '#fff',
  borderRadius: '10px',
  p: 4
};

//Image Modal Style 
export const IMAGE_MODAL_STYLE = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  maxWidth: '95vw',
  width: "auto",
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 'none',
  backgroundColor: 'none',
  borderRadius: 'none',
  p: 0,
  outline: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
export const CLOSE_ICON_STYLE = {
  cursor: 'pointer',
  fontSize: '24px',
  position: 'absolute',
  top: '10px', // Adjusted top position
  right: '10px',
  color: '#fff',
  backgroundColor: '#000',
  borderRadius: '50%',
  padding: '2px',
  zIndex: 100
}


export const IMAGE_STYLE = {
  display: 'block',
  border: 'none',
  maxWidth: "95vw",
  margin: 0,
  borderRadius: '8px',
  objectFit: 'contain'
};

export const ARROW_ICON_STYLE = {
  position: 'absolute',
  bottom: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'grey',
  borderRadius: '50%',
  padding: '3px'
};

export const ARROW_STYLE = {
  fontSize: '15px',
  color: '#000',
};
