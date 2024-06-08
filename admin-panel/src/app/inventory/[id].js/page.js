import React, { useState, useEffect } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import api from '@/api';

const InventoryDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [inventory, setInventory] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      if (id) {
        try {
          const response = await api.get(`/inventories/${id}`);
          setInventory(response.data);
        } catch (error) {
          console.error("Error fetching inventory:", error);
        }
      }
    };
    fetchInventory();
  }, [id]);

  const handleChange = (e, field) => {
    const { value } = e.target;
    setInventory((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    try {
      await api.put(`/inventories/${id}`, { [field]: inventory[field] });
    } catch (error) {
      console.error("Error saving inventory:", error);
    }
  };

  if (!inventory) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box p={4}>
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
