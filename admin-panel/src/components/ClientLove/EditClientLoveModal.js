import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography, IconButton } from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import api from "@/api";
import Cookies from "js-cookie";
import ErrorSnackbar from "@/src/components/errorcomp";

export default function EditClientLoveModal({ open, entry, handleClose, refresh }) {
  const [formDataVal, setFormData] = useState({
    image: entry.imageUrl || null,
    video: entry.video || null,
    text: entry.text
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ open: false, severity: "error", message: "" });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (files) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0]  // Store the File object
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prevState) => ({
      ...prevState,
      image: null  // Clear the image File object
    }));
  };

  const handleRemoveVideo = () => {
    setFormData((prevState) => ({
      ...prevState,
      video: null  // Clear the video File object
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    const form = new FormData();
    if (formDataVal.image instanceof File) {
      form.append("image", formDataVal.image);
    }
    if (formDataVal.video instanceof File) {
      form.append("video", formDataVal.video);
    }

    form.append("text", formDataVal.text);

    try {
      await api.put(`/clientLove/${entry.id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          "type": "formData"
        }
      });
      setError({ open: true, severity: "success", message: "Client Love entry updated successfully" });
      refresh();
      handleClose();
    } catch (error) {
      setError({ open: true, severity: "error", message: error?.response?.data?.message || "An error occurred while updating Client Love entry" });
      console.error("Error updating Client Love entry:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError({ open: false });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-client-love-modal"
      aria-describedby="edit-client-love-modal-description"
    >
      <Box
        p={4}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          textAlign: "center"
        }}
      >
        <Typography variant="h6" mb={2}>Edit Client Love</Typography>
        {formDataVal.image && typeof formDataVal.image === "string" && (  // Check if image is a string (URL)
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography mr={1}>{formDataVal.image}</Typography>  {/* Display current image URL */}
            <IconButton color="error" onClick={handleRemoveImage}>
              <Delete />
            </IconButton>
          </Box>
        )}
        {formDataVal.video && typeof formDataVal.video === "string" && (  // Check if video is a string (URL)
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography mb={1}>{formDataVal.video}</Typography>  {/* Display current video URL */}
            <IconButton color="error" onClick={handleRemoveVideo}>
              <Delete />
            </IconButton>
          </Box>
        )}
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          fullWidth
          sx={{ mb: 2 }}
        >
          Upload Image
          <input
            type="file"
            name="image"
            accept="image/*"
            hidden
            onChange={handleChange}
          />
        </Button>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          fullWidth
          sx={{ mb: 2 }}
        >
          Upload Video
          <input
            type="file"
            name="video"
            accept="video/*"
            hidden
            onChange={handleChange}
          />
        </Button>
        <TextField
          name="text"
          label="Text"
          value={formDataVal.text}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            fullWidth
            sx={{ mx: 1 }}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClose}
            disabled={loading}
            fullWidth
            sx={{ mx: 1 }}
          >
            Cancel
          </Button>
        </Box>
        <ErrorSnackbar open={error.open} message={error.message} handleClose={handleCloseSnackbar} />
      </Box>
    </Modal>
  );
}
