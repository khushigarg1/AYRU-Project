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
import api from "../../../api";
import { useMediaQuery } from "@mui/material";
import ErrorSnackbar from "../../components/errorcomp";
import Link from "next/link";

export default function wishlist() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [loading, setLoading] = useState(true);
  const [wishlists, setwishlists] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedwishlist, setSelectedwishlist] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "userId", headerName: "User ID", width: 90 },
    { field: "userName", headerName: "User Name", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "inventoryId", headerName: "Inventory ID", width: 110 },
    {
      field: "skuId", headerName: "SKU", width: 150,
      valueGetter: (params) => params.row.Inventory?.skuId || "-",
    },
    { field: "productName", headerName: "Product Name", width: 350 },
    {
      field: "categoryName", headerName: "Category Name", width: 250,
      valueGetter: (params) => params.row.Inventory?.Category?.categoryName || "-",
    },
    { field: "sellingPrice", headerName: "Selling Price", width: 120 },
    { field: "discountedPrice", headerName: "Discounted Price", width: 150 }, {
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
    getwishlists();
  }, [refresh]);

  async function getwishlists() {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      const response = await api.get("/wishlist");
      const wishlistData = response.data?.data?.wishlists?.map(wishlist => ({
        ...wishlist,
        userName: wishlist?.User?.firstName ? `${wishlist.User.firstName} ${wishlist.User.lastName}` : wishlist?.User?.username,
        email: wishlist?.User?.email ? wishlist.User.email : wishlist?.User?.email,
        productName: wishlist?.Inventory?.productName,
        sellingPrice: wishlist?.Inventory?.sellingPrice,
        discountedPrice: wishlist?.Inventory?.discountedPrice,
      }));
      setwishlists(wishlistData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      setError({ open: true, severity: "error", message: "Failed to fetch wishlist data." });
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

  const handleViewMore = (wishlist) => {
    setSelectedwishlist(wishlist);
  };

  const handleCloseModal = () => {
    setSelectedwishlist(null);
  };

  return (
    <>
      <Container disableGutters maxWidth="fixed">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">wishlists ({wishlists?.length})</Typography>
          <Button variant="outlined" onClick={toggleRefresh}>
            Refresh
          </Button>
        </Box>
        <Box sx={{ height: "80vh" }}>
          <ThemeProvider theme={theme}>
            <DataGrid
              rows={wishlists}
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
      <Modal open={!!selectedwishlist} onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Paper sx={{ padding: 3, width: 400, margin: "auto", mt: 4, maxHeight: "80vh", position: "relative", overflow: "auto" }}>
          <Typography variant="h6">wishlist Details</Typography>
          {selectedwishlist && (
            <List>
              {Object.entries(selectedwishlist).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText
                    primary={<Typography variant="body1"><strong>{key}:</strong> {value ? value.toString() : "-"}</Typography>}
                  />
                </ListItem>
              ))}

              {selectedwishlist.Inventory && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        <strong>Inventory Page:</strong>{" "}
                        <Link href={`/inventory/${selectedwishlist.Inventory.id}`} passHref>
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
