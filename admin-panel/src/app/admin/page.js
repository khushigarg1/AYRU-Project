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

export default function AdminList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [pageSize, setPageSize] = useState(5);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phoneNumber", headerName: "Phone Number", width: 250 },
    { field: "isActive", headerName: "Is Active", width: 250 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 300,
      valueGetter: (params) => formatDate(params.row.createdAt),
    },
  ];

  useEffect(() => {
    setLoading(true);
    getAdmins();
  }, [refresh]);

  async function getAdmins() {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      const response = await api.get("/auth/admin");
      const adminData = response.data?.data?.map(admin => ({
        ...admin,
        name: admin.name || "-",
      }));
      setAdmins(adminData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError({ open: true, severity: "error", message: "Failed to fetch admin data." });
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

  const handleViewMore = (admin) => {
    setSelectedAdmin(admin);
  };

  const handleCloseModal = () => {
    setSelectedAdmin(null);
  };

  return (
    <>
      <Container disableGutters maxWidth="fixed">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Admins ({admins?.length})</Typography>
          <Button variant="outlined" onClick={toggleRefresh}>
            Refresh
          </Button>
        </Box>
        <Box sx={{ height: "80vh" }}>
          <ThemeProvider theme={theme}>
            <DataGrid
              rows={admins}
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
                  showQuickFilter: true,
                },
              }}
            />
          </ThemeProvider>
        </Box>
      </Container>
    </>
  );
}
