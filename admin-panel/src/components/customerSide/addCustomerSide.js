"use client"
import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import api from "@/api";

export default function AddCustomerSideDataModal({ setAddModalOpen, refresh }) {
  const [marqueeText, setMarqueeText] = useState("");
  const [extraNote, setExtraNote] = useState("");
  const [additionalText1, setAdditionalText1] = useState("");
  const [additionalText2, setAdditionalText2] = useState("");
  const [additionalText3, setAdditionalText3] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const token = Cookies.get("token");
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const customerSideData = {
      marqueeText,
      extraNote,
      additionalText1,
      additionalText2,
      additionalText3,
    };

    try {
      await api.post("/customer-side-data", customerSideData);
      setAddModalOpen(false);
      refresh();
    } catch (error) {
      console.error("Error adding customer side data:", error);
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
        Add Customer Side Data
      </Typography>
      <Box component="form" sx={{ mt: 2 }} noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Marquee Text"
          value={marqueeText}
          onChange={(e) => setMarqueeText(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Extra Note"
          value={extraNote}
          onChange={(e) => setExtraNote(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Additional Text 1"
          value={additionalText1}
          onChange={(e) => setAdditionalText1(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Additional Text 2"
          value={additionalText2}
          onChange={(e) => setAdditionalText2(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Additional Text 3"
          value={additionalText3}
          onChange={(e) => setAdditionalText3(e.target.value)}
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
          {loading ? "Adding..." : "Add Data"}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={() => setAddModalOpen(false)}
          sx={{ mt: 2 }}
        >
          Cancel
        </Button>
      </Box>
    </Paper>
  );
}
