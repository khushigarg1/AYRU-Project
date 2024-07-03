import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import api from "@/api";
export default function VideoPopup({ open, videoUrl, onClose }) {
  console.log("heyyy", open, videoUrl);
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          textAlign: "center",
          padding: 2,
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 0, right: 0 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <video
          controls
          autoPlay
          style={{ width: "100%" }}
          src={`https://ayru-jaipur.s3.amazonaws.com/${videoUrl}`}
          type="video/mp4"
        />
      </Box>
    </Modal>
  );
}
