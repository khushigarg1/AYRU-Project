"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography, Modal } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme, ThemeProvider } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import Cookies from "js-cookie";
import api from "../../../api";
import ErrorSnackbar from "../../components/errorcomp";
import Link from "next/link";
import { DeleteForever } from "@mui/icons-material";
import { useDemoData } from '@mui/x-data-grid-generator';

const OrderPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [pageSize, setPageSize] = useState(5);

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/availability/all");
      setOrders(response.data?.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError({ open: true, message: "Error fetching orders" });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError({ open: false });
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const columns = isMobile
    ? [
      // { field: "id", headerName: "ID", width: 100 },
      { field: "inventoryid", headerName: "Inventory ID", width: 80 },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params) => (
          <Box>
            <Link href={`/availability/${params.row.id}`} passHref>
              <Button color="primary">Know More</Button>
            </Link>
            {/* <Button color="secondary" onClick={() => handleDelete(params.row.id)}><DeleteForever /></Button> */}
          </Box>
        ),
        width: 120,
      },
      {
        field: "status",
        headerName: "Status",
        width: 100,
        renderCell: (params) => {
          let color;
          switch (params.value) {
            case "approved":
              color = "green";
              break;
            case "pending":
              color = "orange";
              break;
            case "rejected":
              color = "red";
              break;
            default:
              color = "black";
          }
          return <span style={{ color }}>{params.value}</span>;
        },
      },
      {
        field: "productName", headerName: "Product Name", width: 400,
        valueGetter: (params) => params.row.inventory?.productName || "N/A",
      },
      { field: "userId", headerName: "User ID", width: 80 },
      { field: "mobilenumber", headerName: "Mobile Number", width: 150 },
      {
        field: "email", headerName: "Email", width: 250,
        valueGetter: (params) => params.row.user?.email || "N/A",
      },
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
        field: "delete",
        headerName: "Delete",
        renderCell: (params) => (
          <Box>
            {/* <Link href={`/availability/${params.row.id}`} passHref>
              <Button color="primary">Know More</Button>
            </Link> */}
            <Button color="secondary" onClick={() => handleDelete(params.row.id)}><DeleteForever /></Button>
          </Box>
        ),
        width: 100,
      },
    ]
    : [
      // { field: "id", headerName: "ID", width: 80 },
      { field: "inventoryid", headerName: "Inventory ID", width: 100 },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params) => (
          <Box>
            <Link href={`/availability/${params.row.id}`} passHref>
              <Button color="primary">Know More</Button>
            </Link>
            {/* <Button color="secondary" onClick={() => handleDelete(params.row.id)}><DeleteForever /></Button> */}
          </Box>
        ),
        width: 130,
      },
      {
        field: "status",
        headerName: "Status",
        width: 100,
        renderCell: (params) => {
          let color;
          switch (params.value) {
            case "approved":
              color = "green";
              break;
            case "pending":
              color = "orange";
              break;
            case "rejected":
              color = "red";
              break;
            default:
              color = "black";
          }
          return <span style={{ color }}>{params.value}</span>;
        },
      },
      {
        field: "productName", headerName: "Product Name", width: 450,
        valueGetter: (params) => params.row.inventory?.productName || "N/A",
      },
      { field: "userId", headerName: "User ID", width: 100 },
      { field: "mobilenumber", headerName: "Mobile Number", width: 150 },
      {
        field: "email", headerName: "Email", width: 250,
        valueGetter: (params) => params.row.user?.email || "N/A",
      },
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
        field: "delete",
        headerName: "Delete",
        renderCell: (params) => (
          <Box>
            {/* <Link href={`/availability/${params.row.id}`} passHref>
              <Button color="primary">Know More</Button>
            </Link> */}
            <Button color="secondary" onClick={() => handleDelete(params.row.id)}><DeleteForever /></Button>
          </Box>
        ),
        width: 100,
      },
    ];

  const handleDelete = async (id) => {
    setLoading(true);
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      await api.delete(`/orders/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          type: "formData",
        },
      });
      setError({ open: true, severity: "success", message: "Order deleted successfully" });
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      setError({ open: true, message: "Error deleting order" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container disableGutters maxWidth="fixed">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Availability Management</Typography>
      </Box>
      <Box sx={{ height: "80vh" }}>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={orders}
            columns={columns}
            // autoPageSize
            loading={loading}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20]}
            pagination
          />
          <Button variant="outlined" onClick={handleRefresh}>
            Refresh
          </Button>
        </ThemeProvider>
      </Box>

      <ErrorSnackbar open={error.open} message={error.message} handleClose={handleCloseSnackbar} />
    </Container>
  );
};
export default OrderPage;