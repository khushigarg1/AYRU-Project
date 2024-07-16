import React, { useState, useEffect } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import api from "@/api";
import Cookies from "js-cookie";
import ErrorSnackbar from "../../errorcomp";

export default function EditFlatModal({ flat, setEditFlatOpen, refresh }) {
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [name, setName] = useState(flat.name);
  const [size, setSize] = useState(flat.size);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setError({ open: false })
  }
  const handleSubmit = async () => {
    setLoading(true);
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    const flatData = {
      name,
      size,
    };

    try {
      await api.put(`/flat/${flat.id}`, flatData);
      setEditFlatOpen(false);
      refresh();
    } catch (error) {
      setError({
        open: true,
        severity: "error",
        message: error?.response?.data?.error
      })
      console.error("Error updating flat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper
        variant="outlined"
        sx={{ padding: 3, width: 400, margin: "auto", mt: 4, position: "relative" }}
      >
        <Typography component="h1" variant="h5" align="center">
          Edit Flat
        </Typography>
        <Box component="form" sx={{ mt: 2 }} noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Flat Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            margin="normal"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Updating..." : "Update Flat"}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => setEditFlatOpen(false)}
            sx={{ mt: 2 }}
          >
            Back
          </Button>
        </Box>
      </Paper>
      <ErrorSnackbar open={error?.open} message={error?.message} handleClose={handleClose} />
    </>
  );
}
