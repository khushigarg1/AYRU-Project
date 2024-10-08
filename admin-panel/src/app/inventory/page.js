"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography, Modal } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme, ThemeProvider } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import Cookies from "js-cookie";
import api from "../../../api";
import ErrorSnackbar from "../../components/errorcomp";
import CreateInventoryModal from "../../components/Inventory/createInventoryModal";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { DeleteForever } from "@mui/icons-material";
import { useDemoData } from '@mui/x-data-grid-generator';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [inventories, setInventories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchInventories();
    fetchCategories();
  }, []);

  const fetchInventories = async () => {
    setLoading(true);
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      const response = await api.get("/inventory/all", {
        headers: {
          "Content-Type": "multipart/form-data",
          "type": "formData"
        }
      });
      setInventories(response.data.data);
    } catch (error) {
      console.error("Error fetching inventories:", error);
      setError({ open: true, message: "Error fetching inventories" });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response?.data?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError({ open: true, message: "Error fetching categories" });
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleCloseSnackbar = () => {
    setError({ open: false });
  };

  const handleRefresh = () => {
    fetchInventories();
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.categoryName : "-";
  };

  const getSubcategoryName = (categoryId, subcategoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return "-";
    const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
    return subcategory ? subcategory.subcategoryName : "-";
  };


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const columns = isMobile ? [
    { field: "id", headerName: "ID", width: 80 },
    { field: "productName", headerName: "Product Name", width: 450 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Box>
          <Link href={`/inventory/${params.row.id}`} passHref>
            <Button color="primary">Know More</Button>
          </Link>
          {/* <Button color="secondary" onClick={() => handleDelete(params.row.id)}><DeleteForever /></Button> */}
        </Box>
      ),
      width: 180
    },
    { field: "categoryId", headerName: "Category", width: 150, renderCell: (params) => getCategoryName(params.row.categoryId) },
    {
      field: "extraOptionOutOfStock",
      headerName: "Out of Stock",
      width: 180,
      type: "boolean",
      renderCell: (params) => (
        <span
          style={{
            color: params.value ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {params.value ? "True" : "False"}
        </span>
      ),
    },
    { field: "skuId", headerName: "SKU ID", width: 180 },
    { field: "sellingPrice", headerName: "Selling Price", width: 130 },
    { field: "discountedPrice", headerName: "Discounted Price", width: 130 },
    // { field: "subCategoryId", headerName: "Subcategory", width: 150, renderCell: (params) => getSubcategoryName(params.row.categoryId, params.row.subCategoryId) },
    // { field: "status", headerName: "Status", width: 140 },
    { field: "productstatus", headerName: "Product Status", width: 130 },
    // { field: "availability", headerName: "Availability", width: 130, type: 'boolean' },
    // { field: "extraOptionOutOfStock", headerName: "Out of Stock", width: 150, type: 'boolean' },
    // { field: "sale", headerName: "SaleItem", width: 150, type: 'boolean' },
    {
      field: "availability",
      headerName: "Availability",
      width: 180,
      type: "boolean",
      renderCell: (params) => (
        <span
          style={{
            color: params.value ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {params.value ? "True" : "False"}
        </span>
      ),
    },
    {
      field: "sale",
      headerName: "Sale Item",
      width: 180,
      type: "boolean",
      renderCell: (params) => (
        <span
          style={{
            color: params.value ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {params.value ? "True" : "False"}
        </span>
      ),
    },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "soldQuantity", headerName: "Sold Quantity", width: 100 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      valueGetter: (params) => formatDate(params.row.createdAt)
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 200,
      valueGetter: (params) => formatDate(params.row.updatedAt)
    },
    {
      field: "Delete",
      headerName: "Delete",
      renderCell: (params) => (
        <Box>
          <Button color="secondary" onClick={() => handleDelete(params.row.id)}><DeleteForever /></Button>
        </Box>
      ),
      width: 100
    },
  ] : [
    { field: "id", headerName: "ID", width: 80 },
    { field: "productName", headerName: "Product Name", width: 450 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Box>
          <Link href={`/inventory/${params.row.id}`} passHref>
            <Button color="primary">Know More</Button>
          </Link>
          {/* <Button color="secondary" onClick={() => handleDelete(params.row.id)}><DeleteForever /></Button> */}
        </Box>
      ),
      width: 130
    },
    { field: "categoryId", headerName: "Category", width: 150, renderCell: (params) => getCategoryName(params?.row?.categoryId) },
    {
      field: "extraOptionOutOfStock",
      headerName: "Out of Stock",
      width: 180,
      type: "boolean",
      renderCell: (params) => (
        <span
          style={{
            color: params.value ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {params.value ? "True" : "False"}
        </span>
      ),
    },
    { field: "skuId", headerName: "SKU ID", width: 180 },
    { field: "sellingPrice", headerName: "Selling Price", width: 150 },
    { field: "discountedPrice", headerName: "Discounted Price", width: 150 },
    // { field: "subCategoryId", headerName: "Subcategory", width: 150, renderCell: (params) => getSubcategoryName(params?.row?.categoryId, params.row.subCategoryId) },
    // { field: "status", headerName: "Status", width: 150 },
    // { field: "productstatus", headerName: "Product Status", width: 180 },
    // { field: "availability", headerName: "Availability", width: 180, type: 'boolean' },
    // { field: "extraOptionOutOfStock", headerName: "Out of Stock", width: 180, type: 'boolean' },
    {
      field: "availability",
      headerName: "Availability",
      width: 180,
      type: "boolean",
      renderCell: (params) => (
        <span
          style={{
            color: params.value ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {params.value ? "True" : "False"}
        </span>
      ),
    },
    {
      field: "sale",
      headerName: "Sale Item",
      width: 180,
      type: "boolean",
      renderCell: (params) => (
        <span
          style={{
            color: params.value ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {params.value ? "True" : "False"}
        </span>
      ),
    },
    // { field: "sale", headerName: "SaleItem", width: 180, type: 'boolean' },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "soldQuantity", headerName: "Sold Quantity", width: 100 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      valueGetter: (params) => formatDate(params.row.createdAt)
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 200,
      valueGetter: (params) => formatDate(params.row.updatedAt)
    },
    {
      field: "Delete",
      headerName: "Delete",
      renderCell: (params) => (
        <Box>
          <Button color="secondary" onClick={() => handleDelete(params.row.id)}><DeleteForever /></Button>
        </Box>
      ),
      width: 100
    },
  ];
  const handleDelete = async (id) => {
    setLoading(true);
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      await api.delete(`/inventory/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          "type": "formData"
        }
      });
      setError({ open: true, severity: 'success', message: 'Inventory item deleted successfully' });
      fetchInventories();
    } catch (error) {
      console.error('Error deleting inventory:', error);
      setError({ open: true, message: 'Error deleting inventory' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container disableGutters maxWidth="fixed">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Inventory Management</Typography>
        <Button
          onClick={handleOpenModal}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            position: "fixed", right: 20,
            zIndex: 1000
          }}        >
          NEW
        </Button>
      </Box>
      <Box sx={{ height: "80vh" }}>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={inventories}
            columns={columns}
            // autoPageSize
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20]}
            pagination
            loading={loading}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true
              }
            }}
          />
          <Button variant="outlined" onClick={handleRefresh}>
            Refresh
          </Button>
        </ThemeProvider>
      </Box>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box>
          <CreateInventoryModal open={modalOpen} handleClose={handleCloseModal} refresh={handleRefresh} />
        </Box>
      </Modal>

      <ErrorSnackbar open={error.open} message={error.message} handleClose={handleCloseSnackbar} />
    </Container>
  );
};

export default HomePage;
