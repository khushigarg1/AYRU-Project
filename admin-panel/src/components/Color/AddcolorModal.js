import * as React from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import api from "../../../api";
import Cookies from "js-cookie";

export default function AddColorModal({ setAddColorOpen, refresh }) {
  const [name, setName] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    const colorData = {
      name,
      colorCode,
    };

    try {
      await api.post("/color", colorData);
      setAddColorOpen(false);
      refresh();
    } catch (error) {
      console.error("Error creating color:", error);
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
        Create Color
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
          {loading ? "Creating..." : "Create Color"}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={() => setAddColorOpen(false)}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </Box>
    </Paper>
  );
}
