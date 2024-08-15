"use client"
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { DataGrid, GridDeleteIcon, GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Cookies from "js-cookie";
import api from "../../../api";
import AddCustomerSideDataModal from "../../components/customerSide/addCustomerSide";
import EditCustomerSideDataModal from "../../components/customerSide/editCustomerSide";
import ErrorSnackbar from "../../components/errorcomp";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

export default function CustomerSideDataManager() {
  const theme = useTheme();
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [loading, setLoading] = useState(true);
  const [customerSideData, setCustomerSideData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const handleAddModalOpen = () => setAddModalOpen(true);
  const handleAddModalClose = () => setAddModalOpen(false);
  const handleEditModalOpen = (data) => {
    setSelectedData(data);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => setEditModalOpen(false);

  const handleDeleteData = async (id) => {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      await api.delete(`/customer-side-data/${id}`);
      toggleRefresh();
    } catch (error) {
      setError({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "An error occurred while deleting the data.",
      });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "marqueeText", headerName: "Marquee Text", width: 200 },
    { field: "extraNote", headerName: "Extra Note", width: 200 },
    { field: "additionalText1", headerName: "Additional Text 1", width: 200 },
    { field: "additionalText2", headerName: "Additional Text 2", width: 200 },
    { field: "additionalText3", headerName: "Additional Text 3", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <>
          <Button
            color="primary"
            onClick={() => handleEditModalOpen(params.row)}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <IconButton
            color="error"
            onClick={() => handleDeleteData(params.row.id)}
          >
            <GridDeleteIcon />
          </IconButton>
        </>
      ),
      width: 150,
    },
  ];

  useEffect(() => {
    setLoading(true);
    getCustomerSideData();
  }, [refresh]);

  async function getCustomerSideData() {
    const admintoken = Cookies.get("token");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      const response = await api.get("/customer-side-data");
      setCustomerSideData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customer side data:", error);
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

  return (
    <>
      <Container disableGutters maxWidth="fixed">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Customer Side Data</Typography>
          <Button
            onClick={handleAddModalOpen}
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
              rows={customerSideData}
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
        open={addModalOpen}
        onClose={handleAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <AddCustomerSideDataModal
            setAddModalOpen={setAddModalOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>
      <Modal
        open={editModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <EditCustomerSideDataModal
            data={selectedData}
            setEditModalOpen={setEditModalOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>
      <ErrorSnackbar open={error?.open} message={error?.message} handleClose={handleClose} />
    </>
  );
}
