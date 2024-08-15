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

export default function UserList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const columns = [
    {
      field: "id", headerName: "id"
      , width: 100,
    },
    {
      field: "username", headerName: "Username"
      , width: 250,
    },
    {
      field: "email", headerName: "Email", width: 250,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 300,

      valueGetter: (params) => formatDate(params.row.createdAt),
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
    getUsers();
  }, [refresh]);

  async function getUsers() {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      const response = await api.get("/auth");
      const userData = response.data?.data?.map(user => ({
        ...user,
        username: user.username || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "-",
      }));
      setUsers(userData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError({ open: true, severity: "error", message: "Failed to fetch user data." });
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

  const handleViewMore = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <>
      <Container disableGutters maxWidth="fixed">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Users ({users?.length})</Typography>
          <Button variant="outlined" onClick={toggleRefresh}>
            Refresh
          </Button>
        </Box>
        <Box sx={{ height: "80vh" }}>
          <ThemeProvider theme={theme}>
            <DataGrid
              rows={users}
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
      <Modal open={!!selectedUser} onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Paper sx={{ padding: 3, width: 400, margin: "auto", mt: 4, maxHeight: "80vh", position: "relative", overflow: "auto" }}>
          <Typography variant="h6">User Details</Typography>
          {selectedUser && (
            <List>
              {Object.entries(selectedUser).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText
                    primary={<Typography variant="body1"><strong>{key}:</strong> {value ? value.toString() : "-"}</Typography>}
                  />
                </ListItem>
              ))}
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
