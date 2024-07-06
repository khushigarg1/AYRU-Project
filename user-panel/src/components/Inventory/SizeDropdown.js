// import React, { useState } from 'react';
// import { Box, Select, MenuItem, TextField, Typography, Grid } from '@mui/material';

// const CustomDropdown = ({ data }) => {
//   const [selections, setSelections] = useState({
//     selectedOption: '',
//     selectedFlatItem: '',
//     selectedFittedItem: '',
//     selectedFittedDimension: '',
//     selectedCustomFittedItem: '',
//     selectedUnit: 'inch',
//     dimensions: {
//       width: '',
//       height: '',
//       length: ''
//     }
//   });

//   const handleSelectChange = (event) => {
//     const { value } = event.target;
//     setSelections((prevSelections) => ({
//       ...prevSelections,
//       selectedOption: value,
//       selectedFlatItem: '',
//       selectedFittedItem: '',
//       selectedFittedDimension: '',
//       selectedCustomFittedItem: '',
//       selectedUnit: 'inch',
//       dimensions: {
//         width: '',
//         height: '',
//         length: ''
//       }
//     }));
//   };

//   const handleFlatItemChange = (event) => {
//     const { value } = event.target;
//     setSelections((prevSelections) => ({
//       ...prevSelections,
//       selectedFlatItem: value
//     }));
//   };

//   const handleFittedItemChange = (event) => {
//     const { value } = event.target;
//     setSelections((prevSelections) => ({
//       ...prevSelections,
//       selectedFittedItem: value,
//       selectedFittedDimension: ''
//     }));
//   };

//   const handleFittedDimensionChange = (event) => {
//     const { value } = event.target;
//     setSelections((prevSelections) => ({
//       ...prevSelections,
//       selectedFittedDimension: value
//     }));
//   };

//   const handleCustomFittedItemChange = (event) => {
//     const { value } = event.target;
//     setSelections((prevSelections) => ({
//       ...prevSelections,
//       selectedCustomFittedItem: value
//     }));
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setSelections((prevSelections) => ({
//       ...prevSelections,
//       dimensions: {
//         ...prevSelections.dimensions,
//         [name]: value
//       }
//     }));
//   };

//   const handleUnitChange = (event) => {
//     const { value } = event.target;
//     setSelections((prevSelections) => ({
//       ...prevSelections,
//       selectedUnit: value
//     }));
//   };

//   return (
//     <Box>
//       <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Select Fit Type:</Typography>
//       <Select
//         value={selections.selectedOption}
//         onChange={handleSelectChange}
//         displayEmpty
//         sx={{
//           width: '100%', marginBottom: 1,
//           padding: "0px 0px"
//         }}
//         MenuProps={{
//           PaperProps: {
//             style: {
//               padding: 0
//             }
//           }
//         }}
//       >
//         <MenuItem value="" disabled>Select Fit Type</MenuItem>
//         <MenuItem value="flat">Flat</MenuItem>
//         <MenuItem value="fitted">Fitted</MenuItem>
//         <MenuItem value="custom">Custom Fitted</MenuItem>
//       </Select>

//       {selections.selectedOption === 'flat' && (
//         <Box>
//           <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Flat Sizes:</Typography>
//           <Select
//             value={selections.selectedFlatItem}
//             onChange={handleFlatItemChange}
//             displayEmpty
//             sx={{
//               width: '100%', marginBottom: 1,
//               padding: "0px 0px"
//             }}
//           >
//             <MenuItem value="" disabled>Select Flat Size</MenuItem>
//             {data.InventoryFlat.map((item, index) => (
//               <MenuItem key={index} value={item.Flat.name}>
//                 {item.Flat.name} ({item.Flat.size})
//               </MenuItem>
//             ))}
//           </Select>
//         </Box>
//       )}

//       {selections.selectedOption === 'fitted' && (
//         <Box>
//           <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Fitted Sizes:</Typography>
//           <Select
//             value={selections.selectedFittedItem}
//             onChange={handleFittedItemChange}
//             displayEmpty
//             sx={{
//               width: '100%', marginBottom: 1,
//               padding: "0px 0px"
//             }}
//           >
//             <MenuItem value="" disabled>Select Fitted Size</MenuItem>
//             {data.InventoryFitted.map((item, index) => (
//               <MenuItem key={index} value={item.Fitted.id}>
//                 {item.Fitted.name}
//               </MenuItem>
//             ))}
//           </Select>

//           {selections.selectedFittedItem && (
//             <Box>
//               <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Fitted Dimensions: (Length*Width*Height)</Typography>
//               <Select
//                 value={selections.selectedFittedDimension}
//                 onChange={handleFittedDimensionChange}
//                 displayEmpty
//                 sx={{
//                   width: '100%', marginBottom: 1,
//                   padding: "0px 0px"
//                 }}
//               >
//                 <MenuItem value="" disabled>Select Fitted Dimension</MenuItem>
//                 {data.InventoryFitted.find(
//                   (item) => item.Fitted.id === selections.selectedFittedItem
//                 )?.Fitted.FittedDimensions.map((dimension, index) => (
//                   <MenuItem key={index} value={dimension.dimensions}>
//                     {dimension.dimensions}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Box>
//           )}
//         </Box>
//       )}

//       {selections.selectedOption === 'custom' && (
//         <Box>
//           <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Custom Fitted Sizes:</Typography>
//           <Select
//             value={selections.selectedCustomFittedItem}
//             onChange={handleCustomFittedItemChange}
//             displayEmpty
//             sx={{
//               width: '100%', marginBottom: 1,
//               padding: "0px 0px"
//             }}
//           >
//             <MenuItem value="" disabled>Select Custom Fitted Size</MenuItem>
//             {data.customFittedInventory.map((item, index) => (
//               <MenuItem key={index} value={item.customFitted.id}>
//                 {item.customFitted.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </Box>
//       )}

//       {selections.selectedOption === 'custom' && selections.selectedCustomFittedItem && (
//         <>
//           {/* <Box>
//             <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Select Unit:</Typography>
//             <Select
//               value={selections.selectedUnit}
//               onChange={handleUnitChange}
//               displayEmpty
//               sx={{
//                 width: '100%', marginBottom: 1,
//                 padding: "0px 0px"
//               }}
//             >
//               <MenuItem value="inch">Inch</MenuItem>
//               <MenuItem value="cm">Centimeter</MenuItem>
//             </Select>
//           </Box> */}
//           <Box>
//             <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Fill your mattress dimensions for a perfect fit !</Typography>
//             <Grid container spacing={1}>
//               <Grid item xs={3}>
//                 <TextField
//                   label="Length"
//                   name="length"
//                   value={selections.dimensions.length}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={3}>
//                 <TextField
//                   label="Width"
//                   name="width"
//                   value={selections.dimensions.width}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={3}>
//                 <TextField
//                   label="Height"
//                   name="height"
//                   value={selections.dimensions.height}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={3}>
//                 <Select
//                   value={selections.selectedUnit}
//                   onChange={handleUnitChange}
//                   displayEmpty
//                   sx={{
//                     width: '100%', marginBottom: 1,
//                     padding: "0px 0px"
//                   }}
//                 >
//                   <MenuItem value="inch">in</MenuItem>
//                   <MenuItem value="cm">cm</MenuItem>
//                 </Select>
//               </Grid>
//             </Grid>
//           </Box>
//           {/* <Box>
//             <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Enter Custom Dimensions:</Typography>
//             <TextField
//               label="Width"
//               name="width"
//               value={selections.dimensions.width}
//               onChange={handleInputChange}
//               sx={{ width: '100%', marginBottom: 1 }}
//             />
//             <TextField
//               label="Height"
//               name="height"
//               value={selections.dimensions.height}
//               onChange={handleInputChange}
//               sx={{ width: '100%', marginBottom: 1 }}
//             />
//             <TextField
//               label="Length"
//               name="length"
//               value={selections.dimensions.length}
//               onChange={handleInputChange}
//               sx={{ width: '100%', marginBottom: 1 }}
//             />
//           </Box> */}
//         </>
//       )}
//     </Box>
//   );
// };

// export default CustomDropdown;
import React, { useState } from 'react';
import { Box, Select, MenuItem, TextField, Typography, Grid } from '@mui/material';

const CustomDropdown = ({ data }) => {
  const hasBedsheets = data.InventoryFitted.length > 0 || data.customFittedInventory.length > 0;

  const [selections, setSelections] = useState({
    selectedOption: hasBedsheets ? '' : 'flat',
    selectedFlatItem: '',
    selectedFittedItem: '',
    selectedFittedDimension: '',
    selectedCustomFittedItem: '',
    selectedUnit: 'inch',
    dimensions: {
      width: '',
      height: '',
      length: ''
    }
  });

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setSelections((prevSelections) => ({
      ...prevSelections,
      selectedOption: value,
      selectedFlatItem: '',
      selectedFittedItem: '',
      selectedFittedDimension: '',
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
      selectedFittedDimension: ''
    }));
  };

  const handleFittedDimensionChange = (event) => {
    const { value } = event.target;
    setSelections((prevSelections) => ({
      ...prevSelections,
      selectedFittedDimension: value
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
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Select Fit Type:</Typography>
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
            <MenuItem value="" disabled>Select Fit Type</MenuItem>
            <MenuItem value="flat">Flat</MenuItem>
            {data.InventoryFitted.length > 0 &&
              <MenuItem value="fitted">Fitted</MenuItem>
            }
            {data.customFittedInventory.length > 0 &&
              <MenuItem value="custom">Custom Fitted</MenuItem>
            }
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
              padding: "0px 0px"
            }}
          >
            <MenuItem value="" disabled>Select Size</MenuItem>
            {data.InventoryFlat.map((item, index) => (
              <MenuItem key={index} value={item.Flat.name}>
                <Typography
                  component="div"
                  style={{
                    fontSize: item.Flat.name.length > 20 ? '0.7rem' : '1rem',
                    maxWidth: '100%',
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

          {selections.selectedFittedItem && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Fitted Dimensions: (Length*Width*Height)</Typography>
              <Select
                value={selections.selectedFittedDimension}
                onChange={handleFittedDimensionChange}
                displayEmpty
                sx={{
                  width: '100%', marginBottom: 1,
                  padding: "0px 0px"
                }}
              >
                <MenuItem value="" disabled>Select Fitted Dimension</MenuItem>
                {data.InventoryFitted.find(
                  (item) => item.Fitted.id === selections.selectedFittedItem
                )?.Fitted.FittedDimensions.map((dimension, index) => (
                  <MenuItem key={index} value={dimension.dimensions}>
                    <Typography
                      component="div"
                      style={{
                        fontSize: dimension.dimensions > 20 ? '0.7rem' : '1rem',
                        maxWidth: '100%',
                      }}
                    >
                      {dimension.dimensions}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
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
            {data.customFittedInventory.map((item, index) => (
              <MenuItem key={index} value={item.customFitted.id}>
                <Typography
                  component="div"
                  style={{
                    fontSize: item.customFitted?.name?.length > 20 ? '0.7rem' : '1rem',
                    maxWidth: '100%',
                  }}
                >
                  {item.customFitted.name}
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
