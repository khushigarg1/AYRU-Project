"use client"
import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography, Modal, IconButton } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";
import api from "../../../../api";
import CreateCustomFittedModal from "../../../components/sizetype/CustomFitted/AddCustomFittedModal";
import EditCustomFittedModal from "../../../components/sizetype/CustomFitted/EditCustomFittedModal";
import { useMediaQuery } from "@mui/material";
import { DataGrid, GridDeleteIcon, GridToolbar } from "@mui/x-data-grid";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [loading, setLoading] = useState(true);
  const [customFitteds, setCustomFitteds] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addCustomFittedOpen, setAddCustomFittedOpen] = useState(false);
  const [editCustomFittedOpen, setEditCustomFittedOpen] = useState(false);
  const [selectedCustomFitted, setSelectedCustomFitted] = useState(null);

  const handleAddCustomFittedOpen = () => setAddCustomFittedOpen(true);
  const handleAddCustomFittedClose = () => setAddCustomFittedOpen(false);

  const handleEditCustomFittedOpen = (customFitted) => {
    setSelectedCustomFitted(customFitted);
    setEditCustomFittedOpen(true);
  };

  const handleEditCustomFittedClose = () => setEditCustomFittedOpen(false);

  useEffect(() => {
    setLoading(true);
    getCustomFitteds();
  }, [refresh]);

  async function getCustomFitteds() {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      const response = await api.get("/customfitted");
      setCustomFitteds(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching custom fitteds:", error);
    } finally {
      setLoading(false);
    }
  }

  function toggleRefresh() {
    setRefresh((prevRefresh) => !prevRefresh);
  }

  async function handleDeleteCustomFitted(id) {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      await api.delete(`/customfitted/${id}`);
      toggleRefresh();
    } catch (error) {
      setError({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "An error occurred while deleting the custom fitted category.",
      });
      console.error("Error deleting custom fitted:", error);
    }
  }

  const columns = isMobile ? [
    { field: "name", headerName: "Name", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <>
          <Button
            color="primary"
            onClick={() => handleEditCustomFittedOpen(params.row)}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <IconButton
            color="error"
            onClick={() => handleDeleteCustomFitted(params.row.id)}
          >
            <GridDeleteIcon />
          </IconButton>
        </>
      ),
      width: 150,
    },
  ] : [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", width: 200 },
    // Add more columns as needed
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <>
          <Button
            color="primary"
            onClick={() => handleEditCustomFittedOpen(params.row)}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <IconButton
            color="error"
            onClick={() => handleDeleteCustomFitted(params.row.id)}
          >
            <GridDeleteIcon />
          </IconButton>
        </>
      ),
      width: 250,
    },
  ];

  return (
    <>
      <Container disableGutters maxWidth="fixed">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Custom Fitted List</Typography>
          <Button
            onClick={handleAddCustomFittedOpen}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              position: "fixed", right: 20,
              zIndex: 1000
            }}
          >
            NEW
          </Button>
        </Box>
        <Box sx={{ height: "80vh" }}>
          <ThemeProvider theme={theme}>
            <DataGrid
              rows={customFitteds}
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
            <Button variant="outlined" onClick={toggleRefresh}>
              Refresh
            </Button>
          </ThemeProvider>
        </Box>
      </Container>
      <Modal
        open={addCustomFittedOpen}
        onClose={handleAddCustomFittedClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <CreateCustomFittedModal
            setAddCustomFittedOpen={setAddCustomFittedOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>
      <Modal
        open={editCustomFittedOpen}
        onClose={handleEditCustomFittedClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <EditCustomFittedModal
            customFitted={selectedCustomFitted}
            setEditCustomFittedOpen={setEditCustomFittedOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>
    </>
  );
}
