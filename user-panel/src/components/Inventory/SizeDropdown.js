import React, { useState, useEffect, useRef } from 'react';
import { Box, Select, MenuItem, TextField, Typography, Grid, useTheme, Divider } from '@mui/material';

const CustomDropdown = ({ data, selections, setSelections, hasBedsheets }) => {
  const [openDropdown, setOpenDropdown] = useState({
    fitType: false,
    flatItem: false,
    fittedItem: false,
    customFittedItem: false,
    unit: false
  });

  const dropdownRefs = {
    fitType: useRef(null),
    flatItem: useRef(null),
    fittedItem: useRef(null),
    customFittedItem: useRef(null),
    unit: useRef(null)
  };
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

    const handleScroll = () => {
      setOpenDropdown({
        fitType: false,
        flatItem: false,
        fittedItem: false,
        customFittedItem: false,
        unit: false
      });
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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

  const handleDropdownClose = (type) => {
    setOpenDropdown((prevState) => ({ ...prevState, [type]: false }));
  };

  const handleDropdownOpen = (type) => {
    setOpenDropdown((prevState) => ({ ...prevState, [type]: true }));
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
            open={openDropdown.fitType}
            onClose={() => handleDropdownClose('fitType')}
            onOpen={() => handleDropdownOpen('fitType')}
            displayEmpty
            sx={{
              width: '100%', marginBottom: 1,
              padding: "0px 0px",
              fontSize: '0.8rem',
            }}

            MenuProps={{
              PaperProps: {
                sx: {
                  '& .MuiMenuItem-root': {
                    fontFamily: theme.palette.typography.fontFamily,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.background.contrast,
                      '&:hover': {
                        backgroundColor: theme.palette.background.contrast,
                      },
                      '&:focus': {
                        backgroundColor: theme.palette.background.contrast,
                      },
                      '&:active': {
                        backgroundColor: theme.palette.background.contrast,
                      },
                    },
                    '&:active': {
                      backgroundColor: theme.palette.background.contrast,
                    },
                  },
                  // border: "1px solid",
                  // borderColor: theme.palette.background.contrast,
                  // borderRadius: "0px"
                  // backgroundColor: theme.palette.background.contrast
                }
              }
            }}
            ref={dropdownRefs.fitType}

          // label="Select Fit Type"
          >
            <MenuItem sx={{
              fontWeight: 'bold',
              fontSize: '0.8rem',
            }} value="" disabled>
              <Typography variant="body1">Select Fit Type</Typography>
            </MenuItem>
            <MenuItem sx={{
              fontWeight: 'bold',
              fontSize: '0.8rem',
            }} value="flat">
              <Typography variant="body1"
                sx={{
                  fontSize: '0.8rem'
                }}
              >Flat</Typography>
            </MenuItem>
            {data.InventoryFitted.length > 0 && (
              <MenuItem sx={{
                fontWeight: 'bold',
                fontSize: '0.8rem',
              }} value="fitted" >
                <Typography variant="body1"
                  sx={{
                    fontSize: '0.8rem'
                  }}>Fitted</Typography>
              </MenuItem>
            )}
            {data.customFittedInventory.length > 0 && (
              <MenuItem sx={{
                fontWeight: 'bold',
                fontSize: '0.8rem',
              }} value="custom">
                <Typography variant="body1"
                  sx={{
                    fontSize: '0.8rem'
                  }}>Custom Fitted</Typography>
              </MenuItem>
            )}
          </Select>
        </>
      )
      }

      {
        (!hasBedsheets || selections.selectedOption === 'flat') && (
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Sizes:</Typography>
            <Select
              value={selections.selectedFlatItem}
              onChange={handleFlatItemChange}
              open={openDropdown.flatItem}
              onClose={() => handleDropdownClose('flatItem')}
              onOpen={() => handleDropdownOpen('flatItem')}
              displayEmpty
              sx={{
                width: '100%', marginBottom: 1,
                padding: "0px 0px",
                fontFamily: theme.palette.typography.fontFamily, fontWeight: 'bold',
                fontSize: '0.8rem',
                //  borderRadius: "0px"
              }}

              MenuProps={{
                PaperProps: {
                  sx: {
                    '& .MuiMenuItem-root': {
                      fontFamily: theme.palette.typography.fontFamily,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.background.contrast,
                        '&:hover': {
                          backgroundColor: theme.palette.background.contrast,
                        },
                        '&:focus': {
                          backgroundColor: theme.palette.background.contrast,
                        },
                        '&:active': {
                          backgroundColor: theme.palette.background.contrast,
                        },
                      },
                      '&:active': {
                        backgroundColor: theme.palette.background.contrast,
                      },
                    },
                    // border: "1px solid",
                    // borderColor: theme.palette.background.contrast,
                    // borderRadius: "0px"
                    // backgroundColor: theme.palette.background.contrast
                  }
                }
              }}
              ref={dropdownRefs.flatItem}
            >
              <MenuItem sx={{
                fontWeight: 'bold',
                fontSize: '0.8rem',
              }} value="" disabled>Select Size</MenuItem>

              {data.InventoryFlat.map((item, index) => (
                // <>
                <MenuItem key={index} value={item.Flat.id}
                  sx={{
                    padding: '4px 8px',
                    borderBottom: index < data.InventoryFlat.length - 1 && "1px solid rgba(128, 128, 128, 0.2)",
                  }} >
                  <Typography
                    component="div"
                    style={{
                      fontSize: '0.8rem',
                      // fontSize: item.Flat?.name?.length + item?.Flat?.size.length > 40 ? '0.72rem' : '0.8rem',
                      maxWidth: '100%',
                      textDecoration: item?.quantity === 0 ? 'line-through' : 'none',
                      // transform: item?.quantity === 0 ? 'rotate(-45deg)' : 'none',
                      transformOrigin: item?.quantity === 0 ? 'center center' : 'none',
                      textDecorationColor: "gray",
                      color: item?.quantity === 0 ? "gray" : "inherit",
                      fontFamily: theme.palette.typography.fontFamily, fontWeight: 'bold',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                    }}
                  >
                    {item.Flat.name} {item?.Flat?.size && item?.Flat?.size}
                  </Typography>
                </MenuItem>
                // {index < data.InventoryFlat.length - 1 && <Divider />}
                // </>
              ))}
            </Select>
          </Box>
        )
      }

      {
        selections.selectedOption === 'fitted' && (
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Fitted Sizes:</Typography>
            <Select
              value={selections.selectedFittedItem}
              onChange={handleFittedItemChange}
              open={openDropdown.fittedItem}
              onClose={() => handleDropdownClose('fittedItem')}
              onOpen={() => handleDropdownOpen('fittedItem')}
              displayEmpty
              sx={{
                width: '100%', marginBottom: 1,
                padding: "0px 0px",
                fontFamily: theme.palette.typography.fontFamily, fontWeight: 'bold',
                fontSize: '0.8rem',
              }}

              MenuProps={{
                PaperProps: {
                  sx: {
                    '& .MuiMenuItem-root': {
                      fontFamily: theme.palette.typography.fontFamily,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.background.contrast,
                        '&:hover': {
                          backgroundColor: theme.palette.background.contrast,
                        },
                        '&:focus': {
                          backgroundColor: theme.palette.background.contrast,
                        },
                        '&:active': {
                          backgroundColor: theme.palette.background.contrast,
                        },
                      },
                      '&:active': {
                        backgroundColor: theme.palette.background.contrast,
                      },
                    },
                    // border: "1px solid",
                    // borderColor: theme.palette.background.contrast,
                    // borderRadius: "0px"
                    // backgroundColor: theme.palette.background.contrast
                  }
                }
              }}
              ref={dropdownRefs.fittedItem}
            >
              <MenuItem value="" disabled sx={{
                fontWeight: 'bold',
                fontSize: '0.8rem',
              }}>Select Fitted Size</MenuItem>
              {data.InventoryFitted.map((item, index) => (
                <MenuItem key={index} value={item.Fitted.id} sx={{
                  padding: '4px 8px',
                  borderBottom: index < data.InventoryFlat.length - 1 && "1px solid rgba(128, 128, 128, 0.2)",
                }}>
                  <Typography
                    component="div"
                    style={{
                      fontSize: '0.8rem',
                      // fontSize: item.Fitted?.name?.length > 40 ? '0.72rem' : '0.8rem',

                      textDecoration: item?.quantity === 0 ? 'line-through' : 'none',
                      // transform: item?.quantity === 0 ? 'rotate(-45deg)' : 'none',
                      transformOrigin: item?.quantity === 0 ? 'center center' : 'none',
                      textDecorationColor: "gray",
                      color: item?.quantity === 0 ? "gray" : "inherit",
                      fontFamily: theme.palette.typography.fontFamily, fontWeight: 'bold',
                      maxWidth: '100%',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                    }}
                  >
                    {item.Fitted.name}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </Box>
        )
      }

      {
        selections.selectedOption === 'custom' && (
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Custom Fitted Sizes:</Typography>

            <Select
              value={selections.selectedCustomFittedItem}
              onChange={handleCustomFittedItemChange}
              open={openDropdown.customFittedItem}
              onClose={() => handleDropdownClose('customFittedItem')}
              onOpen={() => handleDropdownOpen('customFittedItem')}
              displayEmpty
              sx={{
                width: '100%', marginBottom: 1,
                padding: "0px 0px",
                fontFamily: theme.palette.typography.fontFamily, fontWeight: 'bold',
                fontSize: '0.8rem',
              }}

              MenuProps={{
                PaperProps: {
                  sx: {
                    '& .MuiMenuItem-root': {
                      fontFamily: theme.palette.typography.fontFamily,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.background.contrast,
                        '&:hover': {
                          backgroundColor: theme.palette.background.contrast,
                        },
                        '&:focus': {
                          backgroundColor: theme.palette.background.contrast,
                        },
                        '&:active': {
                          backgroundColor: theme.palette.background.contrast,
                        },
                      },
                      '&:active': {
                        backgroundColor: theme.palette.background.contrast,
                      },
                    },
                    // border: "1px solid",
                    // borderColor: theme.palette.background.contrast,
                    // borderRadius: "0px"
                    // backgroundColor: theme.palette.background.contrast
                  }
                }
              }}
              ref={dropdownRefs.customFittedItem}
            >
              <MenuItem value="" disabled sx={{
                fontWeight: 'bold',
                fontSize: '0.8rem',
              }}>Select Custom Fitted Size</MenuItem>
              {data.InventoryFlat.map((item, index) => (
                <MenuItem key={index} value={item.Flat.id} sx={{
                  padding: '4px 8px',
                  borderBottom: index < data.InventoryFlat.length - 1 && "1px solid rgba(128, 128, 128, 0.2)",
                }}>
                  <Typography
                    component="div"
                    style={{
                      fontSize: '0.8rem',
                      // fontSize: item.Flat?.name?.length + item?.Flat?.size.length > 40 ? '0.72rem' : '0.8rem',
                      maxWidth: '100%',
                      textDecoration: item?.quantity === 0 ? 'line-through' : 'none',
                      // transform: item?.quantity === 0 ? 'rotate(-45deg)' : 'none',
                      transformOrigin: item?.quantity === 0 ? 'center center' : 'none',
                      textDecorationColor: "gray",
                      color: item?.quantity === 0 ? "gray" : "inherit",
                      fontFamily: theme.palette.typography.fontFamily, fontWeight: 'bold',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                    }}
                  >
                    {item.Flat.name}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </Box>
        )
      }

      {
        selections.selectedOption === 'custom' && selections.selectedCustomFittedItem && (
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Fill your mattress dimensions for a perfect fit !</Typography>
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

                  MenuProps={{
                    PaperProps: {
                      sx: {
                        '& .MuiMenuItem-root': {
                          fontFamily: theme.palette.typography.fontFamily,
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                          '&.Mui-selected': {
                            backgroundColor: theme.palette.background.contrast,
                            '&:hover': {
                              backgroundColor: theme.palette.background.contrast,
                            },
                            '&:focus': {
                              backgroundColor: theme.palette.background.contrast,
                            },
                            '&:active': {
                              backgroundColor: theme.palette.background.contrast,
                            },
                          },
                          '&:active': {
                            backgroundColor: theme.palette.background.contrast,
                          },
                        },
                        // border: "1px solid",
                        // borderColor: theme.palette.background.contrast,
                        // borderRadius: "0px"
                        // backgroundColor: theme.palette.background.contrast
                      }
                    }
                  }}
                >
                  <MenuItem value="inch">in</MenuItem>
                  <MenuItem value="cm">cm</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Box>
        )
      }
    </Box >
  );
};

export default CustomDropdown;
