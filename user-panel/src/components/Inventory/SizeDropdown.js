import React, { useState, useEffect } from 'react';
import { Box, Select, MenuItem, TextField, Typography, Grid, useTheme } from '@mui/material';

const CustomDropdown = ({ data, selections, setSelections, hasBedsheets }) => {
  const defaultFlatItem = data.InventoryFlat.length > 0 ? data.InventoryFlat[0].Flat.id : '';
  // console.log(selections);
  const theme = useTheme();
  useEffect(() => {
    setSelections({
      selectedOption: selections?.selectedOption || 'flat',
      selectedFlatItem: selections?.selectedFlatItem ||
        (selections?.selectedFittedItem || selections?.selectedCustomFittedItem ? null : defaultFlatItem),
      selectedFittedItem: selections?.selectedFittedItem || '',
      selectedCustomFittedItem: selections?.selectedCustomFittedItem || '',
      selectedUnit: selections?.selectedUnit || 'inch',
      dimensions: {
        width: selections?.dimensions?.width || '',
        height: selections?.dimensions?.height || '',
        length: selections?.dimensions?.length || ''
      }
    });
  }, [hasBedsheets, defaultFlatItem, setSelections]);

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setSelections((prevSelections) => ({
      ...prevSelections,
      selectedOption: value,
      selectedFlatItem: '',
      selectedFittedItem: '',
      selectedCustomFittedItem: '',
      selectedUnit: 'inch',
      dimensions: {
        width: '',
        height: '',
        length: ''
      }
    }));
  };

  const handleFlatItemChange = (event) => {
    const { value } = event.target;
    setSelections((prevSelections) => ({
      ...prevSelections,
      selectedFlatItem: value
    }));
  };

  const handleFittedItemChange = (event) => {
    const { value } = event.target;
    setSelections((prevSelections) => ({
      ...prevSelections,
      selectedFittedItem: value,
    }));
  };

  const handleCustomFittedItemChange = (event) => {
    const { value } = event.target;
    setSelections((prevSelections) => ({
      ...prevSelections,
      selectedCustomFittedItem: value
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelections((prevSelections) => ({
      ...prevSelections,
      dimensions: {
        ...prevSelections.dimensions,
        [name]: value
      }
    }));
  };

  const handleUnitChange = (event) => {
    const { value } = event.target;
    setSelections((prevSelections) => ({
      ...prevSelections,
      selectedUnit: value
    }));
  };

  return (
    <Box>
      {hasBedsheets && (
        <>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Select Fit Type:</Typography>
          <Select
            value={selections.selectedOption}
            onChange={handleSelectChange}
            displayEmpty
            sx={{
              width: '100%', marginBottom: 1,
              padding: "0px 0px"
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  padding: 0
                }
              }
            }}
          >
            <MenuItem value="" disabled>
              <Typography variant="body1">Select Fit Type</Typography>
            </MenuItem>
            <MenuItem value="flat">
              <Typography variant="body1">Flat</Typography>
            </MenuItem>
            {data.InventoryFitted.length > 0 && (
              <MenuItem value="fitted">
                <Typography variant="body1">Fitted</Typography>
              </MenuItem>
            )}
            {data.customFittedInventory.length > 0 && (
              <MenuItem value="custom">
                <Typography variant="body1">Custom Fitted</Typography>
              </MenuItem>
            )}
          </Select>
        </>
      )}

      {(!hasBedsheets || selections.selectedOption === 'flat') && (
        <Box>
          {/* <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Sizes:</Typography> */}
          <Select
            value={selections.selectedFlatItem}
            onChange={handleFlatItemChange}
            displayEmpty
            sx={{
              width: '100%', marginBottom: 1,
              padding: "0px 0px",
              fontFamily: theme.palette.typography.fontFamily
            }}
          >
            <MenuItem value="" disabled>Select Size</MenuItem>
            {data.InventoryFlat.map((item, index) => (
              <MenuItem key={index} value={item.Flat.id}>
                <Typography
                  component="div"
                  style={{
                    fontSize: item.Flat.name.length > 20 ? '0.8rem' : '1rem',
                    maxWidth: '100%',
                    textDecoration: item?.quantity === 0 ? 'line-through' : 'none',
                    // transform: item?.quantity === 0 ? 'rotate(-45deg)' : 'none',
                    transformOrigin: item?.quantity === 0 ? 'center center' : 'none',
                    textDecorationColor: "gray",
                    color: item?.quantity === 0 ? "gray" : "inherit",
                    fontFamily: theme.palette.typography.fontFamily
                  }}
                >
                  {item.Flat.name} {item?.Flat?.size && item?.Flat?.size}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}

      {selections.selectedOption === 'fitted' && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Fitted Sizes:</Typography>
          <Select
            value={selections.selectedFittedItem}
            onChange={handleFittedItemChange}
            displayEmpty
            sx={{
              width: '100%', marginBottom: 1,
              padding: "0px 0px"
            }}
          >
            <MenuItem value="" disabled>Select Fitted Size</MenuItem>
            {data.InventoryFitted.map((item, index) => (
              <MenuItem key={index} value={item.Fitted.id}>
                <Typography
                  component="div"
                  style={{
                    fontSize: item.Fitted?.name?.length > 20 ? '0.7rem' : '1rem',
                    maxWidth: '100%',
                  }}
                >
                  {item.Fitted.name}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}

      {selections.selectedOption === 'custom' && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Custom Fitted Sizes:</Typography>
          <Select
            value={selections.selectedCustomFittedItem}
            onChange={handleCustomFittedItemChange}
            displayEmpty
            sx={{
              width: '100%', marginBottom: 1,
              padding: "0px 0px"
            }}
          >
            <MenuItem value="" disabled>Select Custom Fitted Size</MenuItem>
            {data.InventoryFlat.map((item, index) => (
              <MenuItem key={index} value={item.Flat.id}>
                <Typography
                  component="div"
                  style={{
                    fontSize: item.Flat?.name?.length > 20 ? '0.7rem' : '1rem',
                    maxWidth: '100%',
                  }}
                >
                  {item.Flat.name}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}

      {selections.selectedOption === 'custom' && selections.selectedCustomFittedItem && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Fill your mattress dimensions for a perfect fit !</Typography>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <TextField
                label="Length"
                name="length"
                value={selections.dimensions.length}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Width"
                name="width"
                value={selections.dimensions.width}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Height"
                name="height"
                value={selections.dimensions.height}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <Select
                value={selections.selectedUnit}
                onChange={handleUnitChange}
                displayEmpty
                sx={{
                  width: '100%', marginBottom: 1,
                  padding: "0px 0px"
                }}
              >
                <MenuItem value="inch">in</MenuItem>
                <MenuItem value="cm">cm</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default CustomDropdown;
