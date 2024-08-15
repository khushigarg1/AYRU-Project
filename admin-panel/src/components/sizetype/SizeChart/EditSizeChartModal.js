// EditselectedSizeChartModal.js
import React, { useState, useEffect, useRef } from "react";
import {

  Box,
  Button,
  Paper,
  TextField,
  Typography,
  IconButton,
  Modal,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import api from "../../../../api";
import Cookies from "js-cookie";
import ErrorSnackbar from "../../errorcomp";
import { GridCloseIcon } from "@mui/x-data-grid";

export default function EditselectedSizeChartModal({ selectedSizeChart, setEditSizeOpen, refresh }) {
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [name, setName] = useState("");
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const sizesContainerRef = useRef(null);

  useEffect(() => {
    if (selectedSizeChart) {
      setName(selectedSizeChart.name);
      setSizes(selectedSizeChart.sizes);
    }
  }, [selectedSizeChart]);

  useEffect(() => {
    if (sizesContainerRef.current) {
      sizesContainerRef.current.scrollTop = sizesContainerRef.current.scrollHeight;
    }
  }, [sizes]);

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const handleAddSize = () => {
    setSizes([...sizes, { name: "", width: "", height: "" }]);
  };

  const handleRemoveSize = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    const selectedSizeChartData = {
      name,
      sizes,
    };

    try {
      await api.put(`/sizechart/${selectedSizeChart.id}`, selectedSizeChartData);
      refresh();
      setEditSizeOpen(false);
    } catch (error) {
      setError({
        open: true,
        severity: "error",
        message: error?.response?.data?.error
      });
      console.error("Error updating size chart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError({ open: false })
  };

  return (
    <Modal
      open={true}
      onClose={() => setEditSizeOpen(false)}
      aria-labelledby="edit-size-chart-modal"
      aria-describedby="edit-size-chart-modal-description"
    >
      <Box
        p={4}
        component={Paper}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" mb={2}>Edit Size Chart</Typography>
        <TextField
          label="Size Chart Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Box ref={sizesContainerRef} maxHeight="300px" overflow="auto">
          {sizes.map((size, index) => (
            <Box display="flex" alignItems="center" key={index}>
              <TextField
                label={`${index + 1} Name`}
                value={size.name}
                onChange={(e) => handleSizeChange(index, "name", e.target.value)}
                fullWidth
                margin="normal"
                sx={{ marginRight: "5px" }}
              />
              <TextField
                label={`${index + 1} Width`}
                value={size.width}
                onChange={(e) => handleSizeChange(index, "width", e.target.value)}
                fullWidth
                margin="normal"
                sx={{ marginRight: "5px" }}
              />
              <TextField
                label={`${index + 1} Height`}
                value={size.height}
                onChange={(e) => handleSizeChange(index, "height", e.target.value)}
                fullWidth
                margin="normal"
              />
              <IconButton
                onClick={() => handleRemoveSize(index)}
                color="primary"
              >
                <GridCloseIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddSize}
          color="primary"
        >
          Add Size
        </Button>
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
            onClick={() => setEditSizeOpen(false)}
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
