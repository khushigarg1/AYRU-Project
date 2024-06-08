import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import api from "@/api";
import Cookies from "js-cookie";
import ErrorSnackbar from "@/src/components/errorcomp";

export default function ClientLoveModal({ open, handleClose, refresh }) {
  const [formDataVal, setFormData] = useState({
    image: null,
    video: null,
    text: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ open: false, severity: "error", message: "" });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (files) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0]
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
      image: null
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log(formDataVal);
    const token = Cookies.get("token");
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const form = new FormData();
    form.append("image", formDataVal.image);
    form.append("video", formDataVal.video);
    form.append("text", formDataVal.text);
    console.log(form);
    try {
      await api.post("/clientLove", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          "type": "formData"
        }
      });
      setError({ open: true, severity: "success", message: "Client Love entry added successfully" });
      refresh();
      handleClose();
    } catch (error) {
      setError({ open: true, severity: "error", message: error?.response?.data?.message || "An error occurred while adding Client Love entry" });
      console.error("Error adding Client Love entry:", error);
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
      aria-labelledby="client-love-modal"
      aria-describedby="client-love-modal-description"
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
        <Typography variant="h6" mb={2}>Add Client Love</Typography>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          fullWidth
          sx={{ mb: 2 }}
        >
          {formDataVal.image ? formDataVal.image.name : "Upload Image"}
          <input
            type="file"
            name="image"
            accept="image/*"
            hidden
            onChange={handleChange}
          />
        </Button>
        {formDataVal.image && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleRemoveImage}
            sx={{ mb: 2 }}
          >
            Remove Image
          </Button>
        )}
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
            {loading ? "Adding..." : "Add"}
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
