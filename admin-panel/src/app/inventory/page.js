"use client"
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import api from '@/api';
import CreateInventoryModal from '@/src/components/Inventory/createInventoryModal';

const HomePage = () => {
  const [inventories, setInventories] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchInventories = async () => {
      const response = await api.get('/inventory');
      console.log(response);
      setInventories(response.data.data);
    };
    fetchInventories();
  }, []);

  const handleKnowMore = (inventory) => {
    router.push(`/inventory/${inventory.id}`);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>Inventory Management</Typography>
      <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ mb: 2 }}>
        Create New Inventory
      </Button>
      <DataGrid rows={inventories} columns={[
        { field: 'productName', headerName: 'Product Name', width: 150 },
        { field: 'skuId', headerName: 'SKU ID', width: 150 },
        { field: 'quantity', headerName: 'Quantity', width: 100 },
        { field: 'sellingPrice', headerName: 'Selling Price', width: 100 },
        {
          field: 'actions',
          headerName: 'Actions',
          width: 150,
          renderCell: (params) => (
            <Button variant="contained" color="primary" onClick={() => handleKnowMore(params.row)}>
              Know More
            </Button>
          )
        }
      ]} pageSize={5} />
      <CreateInventoryModal open={isModalOpen} handleClose={handleCloseModal} />
    </Box>
  );
};

export default HomePage;
