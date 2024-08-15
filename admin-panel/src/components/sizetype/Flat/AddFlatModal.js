import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import api from "../../../../api";
import Cookies from "js-cookie";
import ErrorSnackbar from "../../errorcomp";

export default function CreateFlatModal({ setAddFlatOpen, refresh }) {
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    const flatData = {
      name,
      size,
    };

    try {
      await api.post("/flat", flatData);
      setAddFlatOpen(false);
      refresh();
    } catch (error) {
      setError({
        open: true,
        severity: "error",
        message: error?.response?.data?.error
      })
      console.error("Error creating flat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError({ open: false })
  }
  return (
    <>
      <Paper
        variant="outlined"
        sx={{ padding: 3, width: 400, margin: "auto", mt: 4, position: "relative" }}
      >
        <Typography component="h1" variant="h5" align="center">
          Create Flat
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
            {loading ? "Creating..." : "Create Flat"}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => setAddFlatOpen(false)}
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
