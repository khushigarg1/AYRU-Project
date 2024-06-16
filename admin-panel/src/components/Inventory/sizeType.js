import React, { useState, useEffect } from 'react';
import { Typography, Button, Grid, Checkbox, Select, MenuItem, InputLabel, FormControl, ListItemText } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import api from '@/api';

const SizeChartComponent = ({ inventory, onSave, onCancel, Editadditional }) => {
  const [data, setData] = useState({
    ...inventory, colorIds: inventory.ColorVariations?.map((cv) => cv.colorId),
    flatIds: inventory.InventoryFlat?.map((fv) => fv.flatId),
    customFittedIds: inventory.customFittedInventory?.map((cfv) => cfv.customFittedId),
    fittedIds: inventory.InventoryFitted?.map((fv) => ({ fittedId: fv.fittedId, fittedDimensions: fv.fittedDimensions?.map((fvd) => fvd?.id) })),
    sizecharts: inventory.ProductInventory?.map((scv) => ({ productId: scv.productId, selectedSizes: scv.selectedSizes?.map((scd) => scd?.id) })),
    relatedInventoriesIds: inventory.relatedInventories.map(inv => inv.id)
  });

  const [colors, setColors] = useState([]);
  const [flats, setFlats] = useState([]);
  const [customFitteds, setCustomFitteds] = useState([]);
  const [fitteds, setFitteds] = useState([]);
  const [products, setProducts] = useState([]);
  const [relatedInventories, setRelatedInventories] = useState([]);

  const [newcolorIds, setNewColorIds] = useState([]);
  const [newflatIds, setNewFlatIds] = useState([]);
  const [newcustomFittedIds, setNewCustomFittedIds] = useState([]);
  const [newFitted, setNewFitted] = useState({ fittedId: '', fittedDimensions: [] });
  const [newSizeChart, setNewSizeChart] = useState({ productId: '', selectedSizes: [] });
  const [newrelatedInventoriesIds, setNewRelatedInventoriesIds] = useState([]);

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
    Editadditional(false);
  };

  const handleCancel = () => {
    onCancel();
    setData(inventory);
    Editadditional(false);
  };

  const handleChange = (event, field) => {
    setData((prevState) => ({
      ...prevState,
      [field]: event.target.value
    }));
  };

  const getNames = (selectedIds, items) => {
    return selectedIds.map((id) => {
      const item = items.find((item) => item.id === id);
      return item ? item.name : '';
    }).join(', ');
  };

  const getInventoryNames = (selectedIds, items) => {
    return selectedIds.map((id) => {
      const item = items.find((item) => item.id === id);
      return item ? `${item.id} ${item.productName}` : '';
    }).join(', ');
  };

  const getFittedInfo = (fittedId, fittedDimensions) => {
    const fitted = fitteds.find(f => f.id === fittedId);
    if (fitted) {
      const fittedName = fitted.name;
      const dimensionNames = fitted.FittedDimensions
        .filter(dim => fittedDimensions.includes(dim.id))
        .map(dim => dim.dimensions)
        .join(', ');
      return `${fittedName}: ${dimensionNames}`;
    }
    return '';
  };

  //-------------------------------------------For Fittted Item
  const getFittedName = (fittedId) => {
    const fitted = fitteds.find(f => f.id === fittedId);
    return fitted ? fitted.name : '';
  };

  const getDimensionNames = (fittedId, fittedDimensions) => {
    const fitted = fitteds.find(f => f.id === fittedId);
    if (fitted) {
      const dimensionNames = fitted.FittedDimensions
        .filter(dim => fittedDimensions.includes(dim.id))
        .map(dim => dim.dimensions)
        .join(', ');
      return dimensionNames;
    }
    return '';
  };


  const handleRemoveItem = (field, indexToRemove) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleFittedChange = (event, field) => {
    setNewFitted((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const addNewFitted = () => {
    setData((prev) => ({
      ...prev,
      fittedIds: [
        ...prev.fittedIds,
        { fittedId: newFitted.fittedId, fittedDimensions: newFitted.fittedDimensions },
      ],
    }));
    setNewFitted({ fittedId: '', fittedDimensions: [] });
  };
  //-------------------------------------------For Proiduct/Sizechart Item

  const handleSizeChartChange = (event, field) => {
    if (field === 'productId') {
      setNewSizeChart((prev) => ({
        ...prev,
        [field]: event.target.value,
        selectedSizes: [], // Reset selected sizes when product changes
      }));
    } else if (field === 'selectedSizes') {
      setNewSizeChart((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    }
  };

  const addNewSizeChart = () => {
    setData((prev) => ({
      ...prev,
      sizecharts: [
        ...prev.sizecharts,
        { productId: newSizeChart.productId, selectedSizes: newSizeChart.selectedSizes },
      ],
    }));
    setNewSizeChart({ productId: '', selectedSizes: [] });
  };

  const getProductNames = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : '';
  };

  const getSelectedSizes = (selectedSizes) => {
    return selectedSizes.map(sizeId => {
      const sizeDetails = products.flatMap(p => p.sizes).find(s => s.id === sizeId);
      return sizeDetails ? `${sizeDetails.name} - Width: ${sizeDetails.width}, Height: ${sizeDetails.height}` : '';
    }).join(', ');
  };

  const getSelectedSizeNames = (selectedSizes) => {
    return selectedSizes.map(sizeId => {
      const size = products.flatMap(p => p.sizes).find(s => s.id === sizeId);
      return size ? `${size.name} - Width: ${size.width}, Height: ${size.height}` : '';
    }).join(', ');
  };

  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="color-label">Colors</InputLabel>
          <Select
            labelId="color-label"
            multiple
            value={data.colorIds || []}
            onChange={(e) => handleChange(e, 'colorIds')}
            renderValue={(selected) => getNames(selected, colors)}
          >
            {colors.map((color) => (
              <MenuItem key={color.id} value={color.id}>
                <Checkbox checked={data.colorIds?.includes(color.id)} />
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
            value={data.flatIds || []}
            onChange={(e) => handleChange(e, 'flatIds')}
            renderValue={(selected) => getNames(selected, flats)}
          >
            {flats.map((flat) => (
              <MenuItem key={flat.id} value={flat.id}>
                <Checkbox checked={data.flatIds?.includes(flat.id)} />
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
            value={data.customFittedIds || []}
            onChange={(e) => handleChange(e, 'customFittedIds')}
            renderValue={(selected) => getNames(selected, customFitteds)}
          >
            {customFitteds.map((customfitted) => (
              <MenuItem key={customfitted.id} value={customfitted.id}>
                <Checkbox checked={data.customFittedIds?.includes(customfitted.id)} />
                <ListItemText primary={customfitted.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Fitted:</Typography>
        {data.fittedIds?.map((fitted, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
            <Typography>{getFittedInfo(fitted.fittedId, fitted.fittedDimensions)}</Typography>
            <Button
              color="secondary"
              onClick={() => handleRemoveItem('fittedIds', index)}
              style={{ marginLeft: '10px' }}>
              <DeleteForever />
            </Button>
          </div>
        ))}
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="new-fitted-label">Fitted Items</InputLabel>
          <Select
            labelId="new-fitted-label"
            value={newFitted.fittedId}
            onChange={(e) => handleFittedChange(e, 'fittedId')}
            renderValue={(selected) => getFittedName(selected)}
          >
            {fitteds.map((fitted) => (
              <MenuItem key={fitted.id} value={fitted.id}>
                <ListItemText primary={fitted.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="new-fitted-dimensions-label">Fitted Dimensions</InputLabel>
          <Select
            labelId="new-fitted-dimensions-label"
            multiple
            value={newFitted.fittedDimensions}
            onChange={(e) => handleFittedChange(e, 'fittedDimensions')}
            renderValue={(selected) => getDimensionNames(newFitted.fittedId, selected)}
          >
            {fitteds.find(f => f.id === newFitted.fittedId)?.FittedDimensions.map((dim) => (
              <MenuItem key={dim.id} value={dim.id}>
                <Checkbox checked={newFitted.fittedDimensions.includes(dim.id)} />
                <ListItemText primary={dim.dimensions} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={addNewFitted} sx={{ mt: 2 }}>
          Add Fitted Item
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1">Product Inventory:</Typography>
        {data.sizecharts?.map((product, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <Typography>{getProductNames(product.productId)}</Typography>
            <div style={{ marginLeft: '35px' }}>
              {getSelectedSizes(product.selectedSizes).split(', ').map((sizeDetail, sizeIndex) => (
                <div key={sizeIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <Typography>{sizeDetail}</Typography>
                </div>
              ))}
              <Button
                color="secondary"
                onClick={() => handleRemoveItem('sizecharts', index)}
                style={{ marginLeft: '10px' }}>
                <DeleteForever />
              </Button>
            </div>
          </div>
        ))}
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="new-sizechart-label">Product Inventory</InputLabel>
          <Select
            labelId="new-sizechart-label"
            value={newSizeChart.productId}
            onChange={(e) => handleSizeChartChange(e, 'productId')}
            renderValue={(selected) => getProductNames(selected)}
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                <ListItemText primary={product.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="new-sizechart-sizes-label">Selected Sizes</InputLabel>
          <Select
            labelId="new-sizechart-sizes-label"
            multiple
            value={newSizeChart.selectedSizes}
            onChange={(e) => handleSizeChartChange(e, 'selectedSizes')}
            renderValue={(selected) => getSelectedSizeNames(selected)}
          >
            {products.find(p => p.id === newSizeChart.productId)?.sizes.map((size) => (
              <MenuItem key={size.id} value={size.id}>
                <Checkbox checked={newSizeChart.selectedSizes.includes(size.id)} />
                <ListItemText primary={`${size.name} - Width: ${size.width}, Height: ${size.height}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={addNewSizeChart} sx={{ mt: 2 }}>
          Add Product Inventory
        </Button>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="relatedInventories-label">Related Inventories</InputLabel>
          <Select
            labelId="relatedInventories-label"
            multiple
            value={data.relatedInventoriesIds || []}
            onChange={(e) => handleChange(e, 'relatedInventoriesIds')}
            renderValue={(selected) => getInventoryNames(selected, relatedInventories)}
          >
            {relatedInventories.map((inventory) => (
              <MenuItem key={inventory.id} value={inventory.id}>
                <Checkbox checked={data.relatedInventoriesIds?.includes(inventory.id)} />
                <ListItemText primary={`${inventory.id} ${inventory.productName}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>
          Cancel
        </Button>
      </Grid>
    </Grid >
  );
};

export default SizeChartComponent;
