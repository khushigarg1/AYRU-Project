"use client"
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import api from "@/api";

export default function EditCustomerSideDataModal({ data, setEditModalOpen, refresh }) {
  const [marqueeText, setMarqueeText] = useState("");
  const [extraNote, setExtraNote] = useState("");
  const [additionalText1, setAdditionalText1] = useState("");
  const [additionalText2, setAdditionalText2] = useState("");
  const [additionalText3, setAdditionalText3] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setMarqueeText(data.marqueeText || "");
      setExtraNote(data.extraNote || "");
      setAdditionalText1(data.additionalText1 || "");
      setAdditionalText2(data.additionalText2 || "");
      setAdditionalText3(data.additionalText3 || "");
    }
  }, [data]);

  const handleSubmit = async () => {
    setLoading(true);
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    const updatedData = {
      marqueeText,
      extraNote,
      additionalText1,
      additionalText2,
      additionalText3,
    };

    try {
      await api.put(`/customer-side-data/${data.id}`, updatedData);
      setEditModalOpen(false);
      refresh();
    } catch (error) {
      console.error("Error updating customer side data:", error);
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
        Edit Customer Side Data
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
          {loading ? "Updating..." : "Update Data"}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={() => setEditModalOpen(false)}
          sx={{ mt: 2 }}
        >
          Cancel
        </Button>
      </Box>
    </Paper>
  );
}
