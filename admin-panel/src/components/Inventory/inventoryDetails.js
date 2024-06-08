import React, { useState, useEffect } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams } from 'react-router-dom';
import api from './api'; // Adjust the import based on your project structure

const InventoryDetailsPage = () => {
  const { id } = useParams();
  const [inventory, setInventory] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      const response = await api.get(`/inventories/${id}`);
      setInventory(response.data);
    };
    fetchInventory();
  }, [id]);

  const handleChange = (e, field) => {
    const { value } = e.target;
    setInventory((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    await api.put(`/inventories/${id}`, { [field]: inventory[field] });
  };

  if (!inventory) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>Inventory Details</Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Main Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            label="Product Name"
            value={inventory.productName}
            onChange={(e) => handleChange(e, 'productName')}
            fullWidth
            margin="normal"
          />
          <TextField
            label="SKU ID"
            value={inventory.skuId}
            onChange={(e) => handleChange(e, 'skuId')}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={() => handleSave('productName')} sx={{ mt: 2 }}>
            Save
          </Button>
        </AccordionDetails>
      </Accordion>
      {/* Add more accordions for other sections */}
    </Box>
  );
};

export default InventoryDetailsPage;
