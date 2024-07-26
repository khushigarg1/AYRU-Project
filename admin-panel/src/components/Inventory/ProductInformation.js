"use client"
import React, { useState } from 'react';
import { Typography, TextField, Button, Grid, Checkbox, Select, MenuItem, InputLabel, FormControl, ListItemText } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';

const ProductInformation = ({ inventory, onSave, onCancel }) => {
  const [editedProduct, setEditedProduct] = useState({ ...inventory });
  const [editMode, setEditMode] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newDimension, setNewDimension] = useState('');

  // const handleChange = (e, field) => {
  //   const { value } = e.target;
  //   setEditedProduct((prev) => ({ ...prev, [field]: value }));
  // };
  const handleChange = (e, field) => {
    let { value } = e.target;
    if (field === 'weight' || field === 'itemWeight') {
      value = parseFloat(value);
    }
    setEditedProduct((prev) => ({ ...prev, [field]: value }));
  };


  const handleCheckboxChange = (e, field) => {
    const { checked } = e.target;
    if (checked) {
      setEditedProduct((prev) => ({
        ...prev,
        [field]: [...prev[field], e.target.value],
      }));
    } else {
      setEditedProduct((prev) => ({
        ...prev,
        [field]: prev[field].filter((item) => item !== e.target.value),
      }));
    }
  };

  const handleSave = () => {
    onSave(editedProduct);
    setEditMode(false);
  };

  const handleCancel = () => {
    onCancel();
    setEditedProduct(inventory);
    setEditMode(false);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleAddNewItem = () => {
    if (newItem?.trim() !== '') {
      setEditedProduct((prev) => ({
        ...prev,
        includedItems: [...(prev?.includedItems || []), newItem?.trim()],
      }));
      setNewItem('');
    }
  };

  const handleRemoveItem = (index) => {
    const newItems = editedProduct?.includedItems?.filter((item, i) => i !== index);
    setEditedProduct((prev) => ({
      ...prev,
      includedItems: newItems,
    }));
  };

  const handleAddNewFeature = () => {
    if (newFeature?.trim() !== '') {
      setEditedProduct((prev) => ({
        ...prev,
        specialFeatures: [...(prev?.specialFeatures || []), newFeature?.trim()],

      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = editedProduct?.specialFeatures?.filter((item, i) => i !== index);
    setEditedProduct((prev) => ({
      ...prev,
      specialFeatures: newFeatures,
    }));
  };

  const handleAddNewDimension = () => {
    if (newDimension?.trim() !== '') {
      setEditedProduct((prev) => ({
        ...prev,
        itemDimensions: [...(prev?.itemDimensions || []), newDimension?.trim()],
      }));
      setNewDimension('');
    }
  };

  const handleRemoveDimension = (index) => {
    const newDimensions = editedProduct?.itemDimensions?.filter((item, i) => i !== index);
    setEditedProduct((prev) => ({
      ...prev,
      itemDimensions: newDimensions,
    }));
  };

  const convertObjectToArray = (obj) => {
    return obj ? Object.values(obj) : [];
  };
  const includedItemsArray = Array.isArray(editedProduct?.includedItems) ? editedProduct.includedItems : convertObjectToArray(editedProduct?.includedItems);
  const specialFeaturesArray = Array.isArray(editedProduct?.specialFeatures) ? editedProduct.specialFeatures : convertObjectToArray(editedProduct?.specialFeatures);

  return (
    <Grid container>
      {editMode ? (
        <>
          <Grid item xs={12}>
            <TextField
              label="Weight"
              value={editedProduct?.weight}
              onChange={(e) => handleChange(e, 'weight')}
              fullWidth
              variant="outlined"
              margin="normal"
              // type="number"
              InputProps={{ inputProps: { step: 0.1 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Item Weight"
              value={editedProduct?.itemWeight}
              onChange={(e) => handleChange(e, 'itemWeight')}
              fullWidth
              variant="outlined"
              margin="normal"
              // type="number"
              InputProps={{ inputProps: { step: 0.1 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Style"
              value={editedProduct?.style}
              onChange={(e) => handleChange(e, 'style')}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Pattern"
              value={editedProduct?.pattern}
              onChange={(e) => handleChange(e, 'pattern')}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Fabric"
              value={editedProduct?.fabric}
              onChange={(e) => handleChange(e, 'fabric')}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Type"
              value={editedProduct?.type}
              onChange={(e) => handleChange(e, 'type')}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Size"
              value={editedProduct?.size}
              onChange={(e) => handleChange(e, 'size')}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <div>
              <Typography variant="subtitle1">Included Items:</Typography>
              {editedProduct?.includedItems?.map((item, index) => (
                <div style={{ marginLeft: "10%", display: "flex", flexDirection: "row", alignItems: "center" }} key={index}>
                  <Typography>{item}</Typography>
                  <Button color="secondary" onClick={() => handleRemoveItem(index)} sx={{ ml: 1 }}>
                    <DeleteForever />
                  </Button>
                </div>
              ))}
              <TextField
                label="Add New Item"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handleAddNewItem} sx={{ mt: 1 }}>
                Add Item
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} spacing={0}>
            <Typography variant="subtitle1">Item Dimensions:</Typography>
            {editedProduct?.itemDimensions?.map((dimension, index) => (
              <div key={index} style={{ marginLeft: '10%', display: 'flex', alignItems: 'center' }}>
                <Typography>{dimension}</Typography>
                <Button
                  color="secondary"
                  onClick={() => handleRemoveDimension(index)}
                  style={{ marginLeft: '10px' }}
                >
                  <DeleteForever />
                </Button>
              </div>
            ))}
            <TextField
              label="Item Dimensions"
              value={newDimension}
              onChange={(e) => setNewDimension(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <Button style={{ mb: "2%" }} variant="contained" color="primary" onClick={handleAddNewDimension}>
              Add Dimension
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Color Variation"
              value={editedProduct?.colorVariation}
              onChange={(e) => handleChange(e, 'colorVariation')}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Special Features:</Typography>
            {editedProduct?.specialFeatures?.map((item, index) => (
              <div key={index} style={{ marginLeft: '10%', display: 'flex', alignItems: 'center' }}>
                <Typography>{item}</Typography>
                <Button
                  color="secondary"
                  onClick={() => handleRemoveFeature(index)}
                  style={{ marginLeft: '10px' }}
                >
                  <DeleteForever />
                </Button>
              </div>
            ))}
            <TextField
              label="Add New Feature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAddNewFeature} sx={{ mt: 1 }}>
              Add Feature
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Thread Count"
              value={editedProduct?.threadCount}
              onChange={(e) => handleChange(e, 'threadCount')}
              fullWidth
              variant="outlined"
              margin="normal"
              type="text"
            />
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              label="Item Weight"
              value={editedProduct?.itemWeight}
              onChange={(e) => handleChange(e, 'itemWeight')}
              fullWidth
              variant="outlined"
              margin="normal"
              type="number"
              InputProps={{ inputProps: { step: 0.1 } }}
            />
          </Grid> */}
          <Grid item xs={12}>
            <TextField
              label="Origin"
              value={editedProduct?.origin}
              onChange={(e) => handleChange(e, 'origin')}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Others"
              value={editedProduct?.others}
              onChange={(e) => handleChange(e, 'others')}
              fullWidth
              variant="outlined"
              margin="normal"
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
            <Typography><strong>Weight:</strong> {editedProduct?.weight}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Item Weight:</strong> {editedProduct?.itemWeight}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Style:</strong> {editedProduct?.style}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Pattern:</strong> {editedProduct?.pattern}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Fabric:</strong> {editedProduct?.fabric}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Type:</strong> {editedProduct?.type}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Size:</strong> {editedProduct?.size}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Included Items:</strong></Typography>
            {/* {editedProduct?.includedItems?.map((item, index) => (
              <Typography style={{ marginLeft: "10%" }} key={index}>{item}</Typography>
            ))} */}
            {includedItemsArray?.map((item, index) => (
              <Typography style={{ marginLeft: "10%" }} key={index}>{item}</Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Item Dimensions:</strong></Typography>
            {editedProduct?.itemDimensions?.map((item, index) => (
              <Typography style={{ marginLeft: "10%" }} key={index}>{item}</Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Color Variation:</strong> {editedProduct?.colorVariation}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Special Features:</strong>
            </Typography>
            {/* {editedProduct?.specialFeatures?.map((item, index) => (
              <Typography style={{ marginLeft: "10%" }} key={index}>{item}</Typography>
            ))} */}
            {specialFeaturesArray?.map((item, index) => (
              <Typography style={{ marginLeft: "10%" }} key={index}>{item}</Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Thread Count:</strong> {editedProduct?.threadCount}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Origin:</strong> {editedProduct?.origin}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Others:</strong> {editedProduct?.others}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleEditToggle}>
              Edit
            </Button>
          </Grid>
        </>
      )
      }
    </Grid >
  );
};

export default ProductInformation;
