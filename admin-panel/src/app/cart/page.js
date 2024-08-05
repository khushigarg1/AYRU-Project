"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Modal,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import api from "@/api";
import { useMediaQuery } from "@mui/material";
import ErrorSnackbar from "@/src/components/errorcomp";
import Link from "next/link";

export default function Cart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [loading, setLoading] = useState(true);
  const [carts, setCarts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "userId", headerName: "User ID", width: 90 },
    { field: "userName", headerName: "User Name", width: 150 },
    { field: "inventoryId", headerName: "Inventory ID", width: 110 },
    {
      field: "skuId", headerName: "SKU", width: 150,
      valueGetter: (params) => params.row.Inventory?.skuId || "-",
    },
    { field: "productName", headerName: "Product Name", width: 150 }, {
      field: "categoryName", headerName: "Category Name", width: 250,
      valueGetter: (params) => params.row.Inventory?.Category?.categoryName || "-",
    },
    { field: "quantity", headerName: "Quantity", width: 110 },
    { field: "sizeOption", headerName: "Size Option", width: 120 },
    { field: "selectedFlatItem", headerName: "Selected Flat Item", width: 150 },
    { field: "selectedFittedItem", headerName: "Selected Fitted Item", width: 150 },
    { field: "selectedCustomFittedItem", headerName: "Selected Custom Fitted Item", width: 180 },
    { field: "unit", headerName: "Unit", width: 90 },
    { field: "length", headerName: "Length", width: 90 },
    { field: "width", headerName: "Width", width: 90 },
    { field: "height", headerName: "Height", width: 90 },
    { field: "remark", headerName: "Remark", width: 150 },
    { field: "createdAt", headerName: "Created At", width: 150 },
    { field: "updatedAt", headerName: "Updated At", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button variant="contained" onClick={() => handleViewMore(params.row)}>
          View More
        </Button>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    getCarts();
  }, [refresh]);

  async function getCarts() {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      const response = await api.get("/cart");
      const cartData = response.data?.data?.userCart?.map(cart => ({
        ...cart,
        userName: cart?.User?.firstName ? `${cart.User.firstName} ${cart.User.lastName}` : cart?.User?.username,
        productName: cart?.Inventory?.productName,
      }));
      setCarts(cartData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching carts:", error);
      setError({ open: true, severity: "error", message: "Failed to fetch cart data." });
    } finally {
      setLoading(false);
    }
  }

  function toggleRefresh() {
    setRefresh((prevRefresh) => !prevRefresh);
  }

  const handleClose = () => {
    setError({ open: false });
  };

  const handleViewMore = (cart) => {
    setSelectedCart(cart);
  };

  const handleCloseModal = () => {
    setSelectedCart(null);
  };

  return (
    <>
      <Container disableGutters maxWidth="fixed">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Carts ({carts?.length})</Typography>
          <Button variant="outlined" onClick={toggleRefresh}>
            Refresh
          </Button>
        </Box>
        <Box sx={{ height: "80vh" }}>
          <ThemeProvider theme={theme}>
            <DataGrid
              rows={carts}
              columns={columns}
              autoPageSize
              loading={loading}
              disableRowSelectionOnClick
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            />
          </ThemeProvider>
        </Box>
      </Container>
      <Modal open={!!selectedCart} onClose={handleCloseModal} mt={4} ml={2} mr={2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Paper sx={{ padding: 3, width: 400, margin: "auto", mt: 4, maxHeight: "80vh", position: "relative", overflow: "auto" }}>
          <Typography variant="h6">Cart Details</Typography>
          {selectedCart && (
            <List>
              {Object.entries(selectedCart).map(([key, value]) => (
                <Typography key={key} variant="body1" gutterBottom>
                  <strong>{key}:</strong> {value ? value.toString() : "-"}
                </Typography>
              ))}
              {selectedCart.Inventory && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        <strong>Inventory Page:</strong>{" "}
                        <Link href={`/inventory/${selectedCart.Inventory.id}`} passHref>
                          <Typography component="a" sx={{ color: theme.palette.primary.main, textDecoration: "underline" }}>
                            View Inventory
                          </Typography>
                        </Link>

                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          )}
          <Button variant="contained" onClick={handleCloseModal}>
            Close
          </Button>
        </Paper>
      </Modal>
      <ErrorSnackbar open={error.open} message={error.message} handleClose={handleClose} />
    </>
  );
}
