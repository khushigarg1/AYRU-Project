import React, { useState, useEffect } from "react";
import { Box, Button, Paper, TextField, Typography, Modal } from "@mui/material";
import api from "@/api";
import Cookies from "js-cookie";
import ErrorSnackbar from "../../errorcomp";

export default function EditCustomFittedModal({ customFitted, setEditCustomFittedOpen, refresh }) {
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customFitted) {
      setName(customFitted.name);
    }
  }, [customFitted]);

  const handleSubmit = async () => {
    setLoading(true);
    const token = Cookies.get("token");
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const customFittedData = {
      name,
    };

    try {
      await api.put(`/customfitted/${customFitted.id}`, customFittedData);
      refresh();
      setEditCustomFittedOpen(false);
    } catch (error) {
      setError({
        open: true,
        severity: "error",
        message: error?.response?.data?.error
      });
      console.error("Error updating custom fitted:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError({ open: false })
  }

  return (
    <Modal
      open={true}
      onClose={() => setEditCustomFittedOpen(false)}
      aria-labelledby="edit-custom-fitted-modal"
      aria-describedby="edit-custom-fitted-modal-description"
    >
      <Box
        p={4}
        component={Paper}
        sx={{
          width: 400,
          margin: "auto",
          position: "relative",
          top: "10%",
        }}
      >
        <Typography variant="h6" mb={2}>Edit Custom Fitted</Typography>
        <TextField
          label="Custom Fitted Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setEditCustomFittedOpen(false)}
            disabled={loading}
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        </Box>
        <ErrorSnackbar open={error?.open} message={error?.message} handleClose={handleClose} />
      </Box>
    </Modal>
  );
}
