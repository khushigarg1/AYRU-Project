import React, { useState } from 'react';
import { Typography, TextField, Button, Grid } from '@mui/material';

const ProductDetailsForm = ({ inventory, onSave, onCancel }) => {
  const [editedInventory, setEditedInventory] = useState({ ...inventory });
  const [editMode, setEditMode] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    quantity: '',
    minQuantity: '',
    maxQuantity: '',
  });

  const handleChange = (e, field) => {
    const { value } = e.target;

    // Validate if the entered value is numeric
    if (!(/^\d+$/.test(value))) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [field]: 'Please enter a valid numeric value.',
      }));
    } else {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [field]: '',
      }));
      setEditedInventory((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    const parsedInventory = {
      ...editedInventory,
      quantity: parseInt(editedInventory.quantity),
      minQuantity: parseInt(editedInventory.minQuantity),
      maxQuantity: parseInt(editedInventory.maxQuantity),
    };
    onSave(parsedInventory);
    setEditMode(false);
  };

  const handleCancel = () => {
    onCancel();
    setEditedInventory(inventory);
    setEditMode(false);
    setFieldErrors({
      quantity: '',
      minQuantity: '',
      maxQuantity: '',
    });
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setFieldErrors({
      quantity: '',
      minQuantity: '',
      maxQuantity: '',
    });
  };

  return (
    <Grid container >
      {editMode ? (
        <>
          <Grid item xs={12}>
            <TextField
              label="Product Name"
              value={editedInventory.productName}
              onChange={(e) => handleChange(e, 'productName')}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="SKU ID"
              value={editedInventory.skuId}
              onChange={(e) => handleChange(e, 'skuId')}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Quantity"
              value={editedInventory.quantity}
              onChange={(e) => handleChange(e, 'quantity')}
              fullWidth
              variant="outlined"
              margin="normal"
              type="text"
              error={fieldErrors.quantity !== ''}
              helperText={fieldErrors.quantity}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Min Quantity"
              value={editedInventory.minQuantity}
              onChange={(e) => handleChange(e, 'minQuantity')}
              fullWidth
              variant="outlined"
              margin="normal"
              type="text"
              error={fieldErrors.minQuantity !== ''}
              helperText={fieldErrors.minQuantity}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Max Quantity"
              value={editedInventory.maxQuantity}
              onChange={(e) => handleChange(e, 'maxQuantity')}
              fullWidth
              variant="outlined"
              margin="normal"
              type="text"
              error={fieldErrors.maxQuantity !== ''}
              helperText={fieldErrors.maxQuantity}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12}>
            <Typography><strong>Product Name:</strong> {inventory.productName}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>SKU ID:</strong> {inventory.skuId}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Quantity:</strong> {inventory.quantity}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Min Quantity:</strong> {inventory.minQuantity}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Max Quantity:</strong> {inventory.maxQuantity}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleEditToggle}>
              Edit
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default ProductDetailsForm;
