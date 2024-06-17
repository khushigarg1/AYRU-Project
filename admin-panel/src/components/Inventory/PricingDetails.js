"use client"
import React, { useState } from 'react';
import { Typography, TextField, Button, Grid } from '@mui/material';

const PricingDetailsForm = ({ inventory, onSave, onCancel }) => {
  const [editedPricingDetails, setEditedPricingDetails] = useState({ ...inventory });
  const [editMode, setEditMode] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    sellingPrice: '',
    costPrice: '',
    discountedPrice: '',
    discountCount: '',
  });

  const handleChange = (e, field) => {
    const { value } = e.target;

    if (!(/^\d*\.?\d*$/.test(value))) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [field]: 'Please enter numeric values only.',
      }));
    } else {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [field]: '',
      }));
      setEditedPricingDetails((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    const parsedPricingDetails = {
      ...editedPricingDetails,
      sellingPrice: parseFloat(editedPricingDetails?.sellingPrice),
      costPrice: parseFloat(editedPricingDetails?.costPrice),
      discountedPrice: parseFloat(editedPricingDetails?.discountedPrice),
      discountCount: parseInt(editedPricingDetails?.discountCount),
    };
    onSave(parsedPricingDetails);
    setEditMode(false);
  };

  const handleCancel = () => {
    onCancel();
    setEditedPricingDetails(inventory);
    setEditMode(false);
    setFieldErrors({
      sellingPrice: '',
      costPrice: '',
      discountedPrice: '',
      discountCount: '',
    });
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setFieldErrors({
      sellingPrice: '',
      costPrice: '',
      discountedPrice: '',
      discountCount: '',
    });
  };

  return (
    <Grid container >
      {editMode ? (
        <>
          <Grid item xs={12}>
            <TextField
              label="Selling Price"
              value={editedPricingDetails?.sellingPrice}
              onChange={(e) => handleChange(e, 'sellingPrice')}
              fullWidth
              variant="standard"
              margin="normal"
              type="text"
              error={fieldErrors?.sellingPrice !== ''}
              helperText={fieldErrors?.sellingPrice}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Cost Price"
              value={editedPricingDetails?.costPrice}
              onChange={(e) => handleChange(e, 'costPrice')}
              fullWidth
              variant="standard"
              margin="normal"
              type="text"
              error={fieldErrors?.costPrice !== ''}
              helperText={fieldErrors?.costPrice}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Discounted Price"
              value={editedPricingDetails?.discountedPrice}
              onChange={(e) => handleChange(e, 'discountedPrice')}
              fullWidth
              variant="standard"
              margin="normal"
              type="text"
              error={fieldErrors?.discountedPrice !== ''}
              helperText={fieldErrors?.discountedPrice}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Discount Count"
              value={editedPricingDetails?.discountCount}
              onChange={(e) => handleChange(e, 'discountCount')}
              fullWidth
              variant="standard"
              margin="normal"
              type="text"
              error={fieldErrors?.discountCount !== ''}
              helperText={fieldErrors?.discountCount}
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
            <Typography><strong>Selling Price:</strong> {inventory?.sellingPrice}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Cost Price:</strong> {inventory?.costPrice}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Discounted Price:</strong> {inventory?.discountedPrice}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Discount Count:</strong> {inventory?.discountCount}</Typography>
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

export default PricingDetailsForm;
