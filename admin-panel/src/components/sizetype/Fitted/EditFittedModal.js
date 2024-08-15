"use client"
import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Paper, TextField, Typography, IconButton, Modal } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import api from "../../../../api";
import Cookies from "js-cookie";
import ErrorSnackbar from "../../errorcomp";
import { GridCloseIcon } from "@mui/x-data-grid";

export default function EditFittedModal({ fitted, setEditFittedOpen, refresh }) {
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [name, setName] = useState("");
  const [dimensions, setDimensions] = useState([]);
  const [loading, setLoading] = useState(false);
  const dimensionsContainerRef = useRef(null);

  useEffect(() => {
    if (fitted) {
      setName(fitted.name);
      setDimensions(fitted?.FittedDimensions?.map((dim) => dim.dimensions));
    }
  }, [fitted]);

  const handleDimensionChange = (index, value) => {
    const newDimensions = [...dimensions];
    newDimensions[index] = value;
    setDimensions(newDimensions);
  };

  const handleAddDimension = () => {
    setDimensions([...dimensions, ""]);
  };

  const handleRemoveDimension = (index) => {
    const newDimensions = dimensions.filter((_, i) => i !== index);
    setDimensions(newDimensions);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    const fittedData = {
      name,
      dimensions,
    };

    try {
      await api.put(`/fitted/${fitted.id}`, fittedData);
      refresh();
      setEditFittedOpen(false);
    } catch (error) {
      setError({
        open: true,
        severity: "error",
        message: error?.response?.data?.error
      });
      console.error("Error updating fitted:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dimensionsContainerRef.current) {
      dimensionsContainerRef.current.scrollTop = dimensionsContainerRef.current.scrollHeight;
    }
  }, [dimensions]);

  const handleClose = () => {
    setError({ open: false })
  }
  return (
    <Modal
      open={true}
      onClose={() => setEditFittedOpen(false)}
      aria-labelledby="edit-fitted-modal"
      aria-describedby="edit-fitted-modal-description"
    >
      <Box
        p={4}
        component={Paper}
        sx={{
          width: 400,
          margin: "auto",
          position: "relative",
          top: "10%",
          // left: "50%",
          // transform: "translate(-50%, -50%)",
        }}
      >
        <Typography variant="h6" mb={2}>Edit Fitted</Typography>
        <TextField
          label="Fitted Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        {/* <Box ref={dimensionsContainerRef} maxHeight="300px" overflow="auto">
          {dimensions.map((dimension, index) => (
            <Box display="flex" alignItems="center" key={index} mb={2}>
              <TextField
                label={`Dimension ${index + 1}`}
                value={dimension}
                onChange={(e) => handleDimensionChange(index, e.target.value)}
                fullWidth
                margin="normal"
              />
              <IconButton
                onClick={() => handleRemoveDimension(index)}
                color="primary"
              >
                <GridCloseIcon />
              </IconButton>
            </Box>
          ))}
        </Box> */}
        {/* <Button
          startIcon={<AddIcon />}
          onClick={handleAddDimension}
          color="primary"
        >
          Add Dimension
        </Button> */}
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
            onClick={() => setEditFittedOpen(false)}
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
