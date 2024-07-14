import React, { useState, useEffect } from 'react';
import { Typography, Button, Grid, Checkbox, Select, MenuItem, InputLabel, FormControl, ListItemText, TextField } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import api from '@/api';

const SizeChartComponent = ({ inventory, onSave, onCancel, Editadditional }) => {
  const [data, setData] = useState({
    ...inventory,
    colorIds: inventory?.ColorVariations?.map((cv) => cv?.colorId) || [],
    flatIds: inventory?.InventoryFlat?.map((fv) => ({ ...fv, id: fv.flatId })) || [],
    customFittedIds: inventory?.customFittedInventory?.map((cfv) => ({ ...cfv, id: cfv.customFittedId })) || [],
    fittedIds: inventory?.InventoryFitted?.map((fv) => ({ ...fv, id: fv.fittedId })) || [],
    relatedInventoriesIds: inventory?.relatedInventories?.map(inv => inv.id) || [],
    subCategoryIds: inventory?.InventorySubcategory?.map(inv => inv.subcategoryid) || []
  });
  console.log("dataaa", data);
  const [colors, setColors] = useState([]);
  const [flats, setFlats] = useState([]);
  const [newFlatItem, setNewFlatItem] = useState({
    quantity: 0,
    soldQuantity: 0,
    minQuantity: 0,
    maxQuantity: 0,
    sellingPrice: 0,
    costPrice: 0,
    discountedPrice: 0,
    id: ''
  });

  const [customFitteds, setCustomFitteds] = useState([]);
  const [newCustomFittedItem, setNewCustomFittedItem] = useState({ sellingPrice: 0, costPrice: 0, discountedPrice: 0 });

  const [fitteds, setFitteds] = useState([]);
  const [newFittedItem, setNewFittedItem] = useState({
    quantity: 0,
    soldQuantity: 0,
    minQuantity: 0,
    maxQuantity: 0,
    sellingPrice: 0,
    costPrice: 0,
    discountedPrice: 0,
    id: ''
  });
  const [products, setProducts] = useState([]);
  const [relatedInventories, setRelatedInventories] = useState([]);
  const [newrelatedInventoriesIds, setNewRelatedInventoriesIds] = useState([]);

  useEffect(() => {
    fetchData('/color', setColors);
    fetchData('/flat', setFlats);
    // fetchData('/customfitted', setCustomFitteds);
    fetchData('/fitted', setFitteds);
    // fetchData('/sizechart', setProducts);
    fetchData('/inventory', setRelatedInventories);
  }, []);

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await api.get(`${endpoint}`);
      setter(response?.data?.data);
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

  const handleItemChange = (id, field, value, type) => {
    value = parseFloat(value)
    setData((prevState) => ({
      ...prevState,
      [type]: prevState[type].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleSelectFlat = (event) => {
    const selectedFlatId = event.target.value;
    setNewFlatItem({
      ...newFlatItem,
      id: selectedFlatId
    });
  };
  const handleSelectFitted = (event) => {
    const selectedFittedId = event.target.value;
    setNewFittedItem({
      ...newFittedItem,
      id: selectedFittedId
    });
  };

  const addFlatItem = () => {
    if (
      newFlatItem.soldQuantity !== 0 ||
      newFlatItem.quantity !== 0 ||
      newFlatItem.minQuantity !== 0 ||
      newFlatItem.maxQuantity !== 0 ||
      newFlatItem.sellingPrice !== 0 ||
      newFlatItem.costPrice !== 0 ||
      newFlatItem.discountedPrice !== 0
    ) {
      const newItem = {
        ...newFlatItem,
      };

      setData((prevState) => ({
        ...prevState,
        flatIds: [...prevState.flatIds, newItem]
      }));

      setNewFlatItem({
        quantity: 0,
        soldQuantity: 0,
        minQuantity: 0,
        maxQuantity: 0,
        sellingPrice: 0,
        costPrice: 0,
        discountedPrice: 0,
        id: '' // Reset the flatId field
      });
    }
  };

  const addFittedItem = () => {
    if (
      newFittedItem.soldQuantity !== 0 ||
      newFittedItem.quantity !== 0 ||
      newFittedItem.minQuantity !== 0 ||
      newFittedItem.maxQuantity !== 0 ||
      newFittedItem.sellingPrice !== 0 ||
      newFittedItem.costPrice !== 0 ||
      newFittedItem.discountedPrice !== 0
    ) {
      const newItem = {
        ...newFittedItem,
      };

      setData((prevState) => ({
        ...prevState,
        fittedIds: [...prevState.fittedIds, newItem]
      }));

      setNewFittedItem({
        quantity: 0,
        soldQuantity: 0,
        minQuantity: 0,
        maxQuantity: 0,
        sellingPrice: 0,
        costPrice: 0,
        discountedPrice: 0,
        id: ''
      });
    }
  };

  const handleRemoveFlatItem = (indexToRemove) => {
    setData((prev) => ({
      ...prev,
      flatIds: prev.flatIds.filter((_, index) => index !== indexToRemove),
    }));
  };
  const handleRemoveFittedItem = (indexToRemove) => {
    setData((prev) => ({
      ...prev,
      fittedIds: prev.fittedIds.filter((_, index) => index !== indexToRemove),
    }));
  };

  const getNames = (selectedIds, items) => {
    return selectedIds.map((id) => {
      const item = items?.find((item) => item?.id === id);
      return item ? item?.name : '';
    }).join(', ');
  };

  const getInventoryNames = (selectedIds, items) => {
    return selectedIds?.map((id) => {
      const item = items?.find((item) => item?.id === id);
      return item ? `${item.id} ${item?.productName}` : '';
    }).join(', ');
  };


  const addCustomFittedItem = () => {
    if (
      newCustomFittedItem.sellingPrice !== 0 ||
      newCustomFittedItem.costPrice !== 0 ||
      newCustomFittedItem.discountedPrice !== 0
    ) {
      setData((prevState) => ({
        ...prevState,
        customFittedIds: [...prevState.customFittedIds, { ...newCustomFittedItem, id: Date.now() }]
      }));

      setNewCustomFittedItem({ sellingPrice: 0, costPrice: 0, discountedPrice: 0 });
    }
  };

  const handleRemoveCustomFittedItem = (indexToRemove) => {
    setData((prev) => ({
      ...prev,
      customFittedIds: prev.customFittedIds.filter((_, index) => index !== indexToRemove),
    }));
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="color-label">Colors</InputLabel>
          <Select
            labelId="color-label"
            multiple
            value={data?.colorIds || []}
            onChange={(e) => handleChange(e, 'colorIds')}
            renderValue={(selected) => getNames(selected, colors)}
          >
            {colors?.map((color) => (
              <MenuItem key={color?.id} value={color?.id}>
                <Checkbox checked={data?.colorIds?.includes(color?.id)} />
                <ListItemText primary={color?.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Typography>Flat Items:</Typography>
        {data?.flatIds?.map((flat, index) => (
          <Grid item xs={12} key={index}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', flexDirection: "column" }}>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>{flat?.Flat?.name}</Typography>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Quantity: {flat?.quantity}</Typography>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Sold Quantity: {flat?.soldQuantity}</Typography>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Min Quantity: {flat?.minQuantity}</Typography>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Max Quantity: {flat?.maxQuantity}</Typography>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Selling Price: {flat?.sellingPrice}</Typography>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Cost Price: {flat?.costPrice}</Typography>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Discounted Price: {flat?.discountedPrice}</Typography>
              <Button
                color="secondary"
                onClick={() => handleRemoveFlatItem(index)}
                style={{ marginLeft: '10px' }}
              >
                <DeleteForever />
              </Button>
            </div>
          </Grid>
        ))}
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="flat-label">Flat</InputLabel>
          <Select
            labelId="flat-label"
            value={newFlatItem.flatId}
            onChange={handleSelectFlat}
            renderValue={(selected) => {
              const selectedFlat = flats.find(flat => flat.id === selected);
              return selectedFlat ? selectedFlat.name : '';
            }}
          >
            {flats?.map((flat) => (
              <MenuItem key={flat?.id} value={flat?.id}>
                {flat?.name}
              </MenuItem>
            ))}
          </Select>
          {newFlatItem.id && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  type="number"
                  label="Quantity"
                  value={newFlatItem.quantity}
                  onChange={(e) => setNewFlatItem({ ...newFlatItem, quantity: parseInt(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  label="Sold Quantity"
                  value={newFlatItem.soldQuantity}
                  onChange={(e) => setNewFlatItem({ ...newFlatItem, soldQuantity: parseInt(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  type="number"
                  label="Min Quantity"
                  value={newFlatItem.minQuantity}
                  onChange={(e) => setNewFlatItem({ ...newFlatItem, minQuantity: parseInt(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  type="number"
                  label="Max Quantity"
                  value={newFlatItem.maxQuantity}
                  onChange={(e) => setNewFlatItem({ ...newFlatItem, maxQuantity: parseInt(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Selling Price"
                  value={newFlatItem.sellingPrice}
                  onChange={(e) => setNewFlatItem({ ...newFlatItem, sellingPrice: parseFloat(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Cost Price"
                  value={newFlatItem.costPrice}
                  onChange={(e) => setNewFlatItem({ ...newFlatItem, costPrice: parseFloat(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Discounted Price"
                  value={newFlatItem.discountedPrice}
                  onChange={(e) => setNewFlatItem({ ...newFlatItem, discountedPrice: parseFloat(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" onClick={addFlatItem}>
                  Add Flat
                </Button>
              </Grid>
            </Grid>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Typography>Fitted Items:</Typography>
        {data?.fittedIds?.map((fitted, index) => (
          <Grid item xs={12} key={index}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', flexDirection: "column" }}>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}> {fitted?.Fitted?.name}</Typography>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Quantity: {fitted?.quantity}</Typography>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Sold Quantity: {fitted?.soldQuantity}</Typography>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Min Quantity: {fitted?.minQuantity}</Typography>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Max Quantity: {fitted?.maxQuantity}</Typography>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Selling Price: {fitted?.sellingPrice}</Typography>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Cost Price: {fitted?.costPrice}</Typography>
              <Typography variant="subtitle1" style={{ marginRight: '20px' }}>Discounted Price: {fitted?.discountedPrice}</Typography>
              <Button
                color="secondary"
                onClick={() => handleRemoveFittedItem(index)}
                style={{ marginLeft: '10px' }}
              >
                <DeleteForever />
              </Button>
            </div>
          </Grid>
        ))}
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="fitted-label">Fitted</InputLabel>
          <Select
            labelId="fitted-label"
            value={newFittedItem.fittedId}
            onChange={handleSelectFitted}
            renderValue={(selected) => {
              const selectedFitted = fitteds.find(fitted => fitted.id === selected);
              return selectedFitted ? selectedFitted.name : '';
            }}
          >
            {fitteds?.map((fitted) => (
              <MenuItem key={fitted?.id} value={fitted?.id}>
                {fitted?.name}
              </MenuItem>
            ))}
          </Select>
          {newFittedItem.id && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={newFittedItem.quantity}
                  onChange={(e) => setNewFittedItem({ ...newFittedItem, quantity: parseInt(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  label="Sold Quantity"
                  value={newFittedItem.soldQuantity}
                  onChange={(e) => setNewFittedItem({ ...newFittedItem, soldQuantity: parseInt(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  label="Min Quantity"
                  value={newFittedItem.minQuantity}
                  onChange={(e) => setNewFittedItem({ ...newFittedItem, minQuantity: parseInt(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  label="Max Quantity"
                  value={newFittedItem.maxQuantity}
                  onChange={(e) => setNewFittedItem({ ...newFittedItem, maxQuantity: parseInt(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Selling Price"
                  value={newFittedItem.sellingPrice}
                  onChange={(e) => setNewFittedItem({ ...newFittedItem, sellingPrice: parseFloat(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Cost Price"
                  value={newFittedItem.costPrice}
                  onChange={(e) => setNewFittedItem({ ...newFittedItem, costPrice: parseFloat(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Discounted Price"
                  value={newFittedItem.discountedPrice}
                  onChange={(e) => setNewFittedItem({ ...newFittedItem, discountedPrice: parseFloat(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" onClick={addFittedItem}>
                  Add Fitted
                </Button>
              </Grid>
            </Grid>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined" margin="normal">
          <Typography id="customFitted-label">Custom Fitted</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Selling Price"
                value={data.customFittedIds[0].sellingPrice}
                onChange={(e) => handleItemChange(data.customFittedIds[0].id, 'sellingPrice', parseFloat(e.target.value), 'customFittedIds')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Cost Price"
                value={data.customFittedIds[0].costPrice}
                onChange={(e) => handleItemChange(data.customFittedIds[0].id, 'costPrice', parseFloat(e.target.value), 'customFittedIds')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Discounted Price"
                value={data.customFittedIds[0].discountedPrice}
                onChange={(e) => handleItemChange(data.customFittedIds[0].id, 'discountedPrice', parseFloat(e.target.value), 'customFittedIds')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button onClick={() => handleRemoveCustomFittedItem(0)}>Remove</Button>
            </Grid>
          </Grid>

          {data.customFittedIds.length == 0 &&
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Selling Price"
                  value={newCustomFittedItem.sellingPrice}
                  onChange={(e) => setNewCustomFittedItem({ ...newCustomFittedItem, sellingPrice: parseFloat(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Cost Price"
                  value={newCustomFittedItem.costPrice}
                  onChange={(e) => setNewCustomFittedItem({ ...newCustomFittedItem, costPrice: parseFloat(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Discounted Price"
                  value={newCustomFittedItem.discountedPrice}
                  onChange={(e) => setNewCustomFittedItem({ ...newCustomFittedItem, discountedPrice: parseFloat(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button onClick={addCustomFittedItem}>Add Custom Fitted</Button>
              </Grid>
            </Grid>
          }

        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="relatedInventories-label">Related Inventories</InputLabel>
          <Select
            labelId="relatedInventories-label"
            multiple
            value={data?.relatedInventoriesIds || []}
            onChange={(e) => handleChange(e, 'relatedInventoriesIds')}
            renderValue={(selected) => getInventoryNames(selected, relatedInventories)}
          >
            {relatedInventories?.map((inventory) => (
              <MenuItem key={inventory?.id} value={inventory?.id}>
                <Checkbox checked={data?.relatedInventoriesIds?.includes(inventory?.id)} />
                <ListItemText primary={`${inventory?.id} ${inventory?.productName}`} />
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
    </Grid>
  );
};

export default SizeChartComponent;
