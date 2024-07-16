import * as React from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import api from "@/api";
import Cookies from "js-cookie";

export default function EditColorModal({ color, setEditColorOpen, refresh }) {
  const [name, setName] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (color) {
      setName(color.name || "");
      setColorCode(color.colorCode || "");
    }
  }, [color]);

  const handleSubmit = async () => {
    setLoading(true);
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    const colorData = {
      name,
      colorCode,
    };

    try {
      await api.put(`/color/${color.id}`, colorData);
      setEditColorOpen(false);
      refresh();
    } catch (error) {
      console.error("Error updating color:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{ padding: 3, width: 400, margin: "auto", mt: 4, position: "relative" }}
    >
      <Typography component="h1" variant="h5" align="center">
        Edit Color
      </Typography>
      <Box component="form" sx={{ mt: 2 }} noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Color Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Color Code"
          value={colorCode}
          onChange={(e) => setColorCode(e.target.value)}
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
          {loading ? "Updating..." : "Update Color"}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={() => setEditColorOpen(false)}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </Box>
    </Paper>
  );
}
