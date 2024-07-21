import * as React from "react";
import { Box, Button, Paper, TextField, Typography, Switch, FormControlLabel } from "@mui/material";
import { useState, useEffect } from "react";
import api from "@/api";
import Cookies from "js-cookie";

export default function EditCategoryModal({ category, setEditCategoryOpen, refresh }) {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setCategoryName(category.categoryName || "");
      setDescription(category.description || "");
      setIcon(category.icon || "");
      setVisible(category.visible || false);
    }
  }, [category]);

  const handleSubmit = async () => {
    setLoading(true);
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    const categoryData = {
      categoryName,
      description,
      icon,
      visible,
    };

    try {
      await api.put(`/category/${category.id}`, categoryData);
      setEditCategoryOpen(false);
      refresh();
    } catch (error) {
      console.error("Error updating category:", error);
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
        Edit Category
      </Typography>
      <Box component="form" sx={{ mt: 2 }} noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Icon URL"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              color="primary"
            />
          }
          label="Visible"
          sx={{ mt: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Updating..." : "Update Category"}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={() => setEditCategoryOpen(false)}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </Box>
    </Paper>
  );
}
