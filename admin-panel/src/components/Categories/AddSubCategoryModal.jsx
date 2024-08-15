import * as React from "react";
import { Box, Button, Paper, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from "@mui/material";
import { useState, useEffect } from "react";
import api from "../../../api"
import Cookies from "js-cookie";

export default function AddSubcategoryModal({ setAddSubcategoryOpen, refresh }) {
  const [subcategoryName, setSubcategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    const subcategoryData = {
      subcategoryName,
      categoryId,
      description,
      icon,
      visible,
    };

    try {
      await api.post("/subcategory", subcategoryData);
      setAddSubcategoryOpen(false);
      refresh();
    } catch (error) {
      console.error("Error creating subcategory:", error);
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
        Create Subcategory
      </Typography>
      <Box component="form" sx={{ mt: 2 }} noValidate autoComplete="off">
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Subcategory Name"
          value={subcategoryName}
          onChange={(e) => setSubcategoryName(e.target.value)}
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
          {loading ? "Creating..." : "Create Subcategory"}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={() => setAddSubcategoryOpen(false)}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </Box>
    </Paper>
  );
}
