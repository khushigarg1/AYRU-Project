import React, { useState, useEffect } from 'react';
import { Typography, Button, Grid, Checkbox, Select, MenuItem, InputLabel, FormControl, ListItemText, Link } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import api from '@/api';

const SizeChartComponent = ({ inventory, onSave, onCancel }) => {
  const [data, setData] = useState(inventory);
  const [editMode, setEditMode] = useState(false);

  const [colors, setColors] = useState([]);
  const [flats, setFlats] = useState([]);
  const [customFitteds, setCustomFitteds] = useState([]);
  const [fitteds, setFitteds] = useState([]);
  const [products, setProducts] = useState([]);
  const [relatedInventories, setRelatedInventories] = useState([]);

  const [newSizeChart, setNewSizeChart] = useState({ productId: '', selectedSizes: [] });
  const [newFitted, setNewFitted] = useState({ fittedId: '', fittedDimensions: [] });

  useEffect(() => {
    fetchData('/color', setColors);
    fetchData('/flat', setFlats);
    fetchData('/customfitted', setCustomFitteds);
    fetchData('/fitted', setFitteds);
    fetchData('/sizechart', setProducts);
    fetchData('/inventory', setRelatedInventories);
  }, []);

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await api.get(`${endpoint}`);
      setter(response.data.data);
    } catch (error) {
      console.error(`Failed to fetch data from ${endpoint}:`, error);
    }
  };

  const handleSave = () => {
    onSave(data);
    setEditMode(false);
  };

  const handleCancel = () => {
    onCancel();
    setData(inventory);
    setEditMode(false);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e, field) => {
    const { value } = e.target;
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = (field, newItem) => {
    if (newItem.trim() !== '') {
      setData((prev) => ({
        ...prev,
        [field]: [...prev[field], newItem.trim()],
      }));
    }
  };

  const handleRemoveItem = (field, index) => {
    const newItems = data[field].filter((_, i) => i !== index);
    setData((prev) => ({
      ...prev,
      [field]: newItems,
    }));
  };

  const handleFittedSelection = (fittedId) => {
    const selectedFitted = fitteds.find(fitted => fitted.id === fittedId);
    if (selectedFitted) {
      setNewFitted({ fittedId: fittedId, fittedDimensions: selectedFitted.FittedDimensions });
    }
  };

  const handleAddFitted = () => {
    setData((prev) => ({
      ...prev,
      fittedIds: [...prev.fittedIds, { fittedId: newFitted.fittedId, fittedDimensions: newFitted.fittedDimensions }],
    }));
  };

  const handleAddSizeChart = () => {
    setData((prev) => ({
      ...prev,
      sizecharts: [...prev.sizecharts, { productId: newSizeChart.productId, selectedSizes: newSizeChart.selectedSizes }],
    }));
  };

  const handleInventoryChange = (inventoryId) => {
    setData((prev) => {
      const updatedInventories = prev.relatedInventories.includes(inventoryId)
        ? prev.relatedInventories.filter(id => id !== inventoryId)
        : [...prev.relatedInventories, inventoryId];
      return { ...prev, relatedInventories: updatedInventories };
    });
  };

  return (
    <Grid container spacing={2}>
      {editMode ? (
        <>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="color-label">Colors</InputLabel>
              {/* <Select
                labelId="color-label"
                multiple
                value={Array.isArray(data.colorIds) ? data.colorIds : []}
                onChange={(e) => handleChange(e, 'colorIds')}
                renderValue={(selected) => selected.join(', ')}
              >
                {colors?.map((color) => (
                  <MenuItem key={color.id} value={color.id}>
                    <Checkbox checked={data.colorIds?.includes(color.id)} />
                    <ListItemText primary={color.name} />
                  </MenuItem>
                ))} */}
              <Select
                labelId="color-label"
                multiple
                value={data.ColorVariations.map((cv) => cv.colorId)}
                onChange={(e) => handleChange(e, 'colorIds')}
                renderValue={(selected) =>
                  selected
                    .map((colorId) => colors.find((color) => color.id === colorId)?.name)
                    .join(', ')
                }
              >
                {colors.map((color) => (
                  <MenuItem key={color.id} value={color.id}>
                    <Checkbox checked={data.ColorVariations.some((cv) => cv.colorId === color.id)} />
                    <ListItemText primary={color.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="flat-label">Flats</InputLabel>
              <Select
                labelId="flat-label"
                multiple
                value={data.InventoryFlat.map((invFlat) => invFlat.flatId)}
                onChange={(e) => handleChange(e, 'flatIds')}
                renderValue={(selected) =>
                  selected
                    .map((flatId) => flats.find((flat) => flat.id === flatId)?.name)
                    .join(', ')
                }
              >
                {flats.map((flat) => (
                  <MenuItem key={flat.id} value={flat.id}>
                    <Checkbox checked={data.InventoryFlat.some((invFlat) => invFlat.flatId === flat.id)} />
                    <ListItemText primary={flat.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="customFitted-label">Custom Fitted</InputLabel>
              <Select
                labelId="customFitted-label"
                multiple
                value={Array.isArray(data.customFittedIds) ? data.customFittedIds : []}
                onChange={(e) => handleChange(e, 'customFittedIds')}
                renderValue={(selected) => selected.join(', ')}
              >
                {customFitteds?.map((fitted) => (
                  <MenuItem key={fitted.id} value={fitted.id}>
                    <Checkbox checked={data.customFittedIds?.includes(fitted.id)} />
                    <ListItemText primary={fitted.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Fitted:</Typography>
            {data.fittedIds?.map((fitted, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <Typography>{fitted.fittedId}</Typography>
                <Button
                  color="secondary"
                  onClick={() => handleRemoveItem('fittedIds', index)}
                  style={{ marginLeft: '10px' }}
                >
                  <DeleteForever />
                </Button>
              </div>
            ))}
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="fitted-label">Fitted</InputLabel>
              <Select
                labelId="fitted-label"
                value={newFitted.fittedId}
                onChange={(e) => handleFittedSelection(e.target.value)}
                label="Fitted"
              >
                {fitteds?.map((fitted) => (
                  <MenuItem key={fitted.id} value={fitted.id}>
                    {fitted.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {newFitted.fittedDimensions.length > 0 && (
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="dimensions-label">Fitted Dimensions</InputLabel>
                <Select
                  labelId="dimensions-label"
                  multiple
                  value={Array.isArray(newFitted.fittedDimensions) ? newFitted.fittedDimensions : []}
                  onChange={(e) => setNewFitted({ ...newFitted, fittedDimensions: e.target.value })}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {newFitted.fittedDimensions?.map((dimension) => (
                    <MenuItem key={dimension.id} value={dimension.id}>
                      <Checkbox checked={newFitted.fittedDimensions?.includes(dimension.id)} />
                      <ListItemText primary={dimension.dimensions} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Button variant="contained" color="primary" onClick={handleAddFitted} sx={{ mt: 1 }}>
              Add Fitted
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Size Charts:</Typography>
            {data.sizecharts?.map((sizechart, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <Typography>{sizechart.productId}</Typography>
                <Button
                  color="secondary"
                  onClick={() => handleRemoveItem('sizecharts', index)}
                  style={{ marginLeft: '10px' }}
                >
                  <DeleteForever />
                </Button>
              </div>
            ))}
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="product-label">Product</InputLabel>
              <Select
                labelId="product-label"
                value={newSizeChart.productId}
                onChange={(e) => setNewSizeChart({ ...newSizeChart, productId: e.target.value })}
                label="Product"
              >
                {products?.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="sizes-label">Sizes</InputLabel>
              <Select
                labelId="sizes-label"
                multiple
                value={Array.isArray(newSizeChart.selectedSizes) ? newSizeChart.selectedSizes : []}
                onChange={(e) => setNewSizeChart({ ...newSizeChart, selectedSizes: e.target.value })}
                renderValue={(selected) => selected.join(', ')}
              >
                {products
                  .find((product) => product.id === newSizeChart.productId)
                  ?.sizes?.map((size) => (
                    <MenuItem key={size.id} value={size.id}>
                      <Checkbox checked={newSizeChart.selectedSizes?.includes(size.id)} />
                      <ListItemText primary={size.size} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleAddSizeChart} sx={{ mt: 1 }}>
              Add Size Chart
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Related Inventories:</Typography>
            {relatedInventories?.map((inventory) => (
              <MenuItem key={inventory.id}>
                <Checkbox
                  checked={data.relatedInventories.includes(inventory.id)}
                  onChange={() => handleInventoryChange(inventory.id)}
                />
                <ListItemText primary={`${inventory.id} ${inventory.productName}`} />
              </MenuItem>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>
              Cancel
            </Button>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12}>
            <Typography variant="h6">Colors:</Typography>
            {data.ColorVariations?.map((color) => (
              <Typography key={color}>{color?.Color?.name}</Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Flats:</Typography>
            {data.InventoryFlat?.map((flat) => (
              <Typography key={flat}>{flat?.Flat?.name}</Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Custom Fitted:</Typography>
            {data.customFittedInventory?.map((custom) => (
              <Typography key={custom}>{custom?.customFitted?.name}</Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Fitted:</Typography>
            {data.InventoryFitted?.map((fitted, index) => (
              <div key={index}>
                <Typography>{fitted?.Fitted?.name}</Typography>
                {fitted?.fittedDimensions?.map((dimension, dimindex) => (
                  <Typography ml={6} key={dimindex} variant="body2">
                    {dimension.dimensions}
                  </Typography>
                ))}
              </div>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Size Charts:</Typography>
            {data.ProductInventory?.map((sizechart, index) => (
              <div key={index}>
                <Typography variant="subtitle1">{sizechart?.product?.name}</Typography>
                {sizechart?.product?.sizes?.map((size, sizeIndex) => (
                  <Typography ml={6} key={sizeIndex} variant="body2">
                    {size.name}
                  </Typography>
                ))}
              </div>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Related Inventories:</Typography>
            {data.relatedInventories?.map((inventory, index) => (
              <Typography>

                <Link
                  key={index}
                  href={`${process.env.REACT_APP_BASE_URL}/inventory/${inventory?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${inventory?.productName} :- ${process.env.REACT_APP_BASE_URL}/inventory/${inventory?.id}`}
                </Link>
              </Typography>
            ))}
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

export default SizeChartComponent;
