"use client"
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Fab,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridDeleteIcon, GridToolbar } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import api from "@/api";
import CreateFlatModal from "@/src/components/sizetype/Flat/AddFlatModal";
import EditFlatModal from "@/src/components/sizetype/Flat/EditFlatModal";
import { useMediaQuery } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [loading, setLoading] = useState(true);
  const [flats, setFlats] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addFlatOpen, setAddFlatOpen] = useState(false);
  const [editFlatOpen, setEditFlatOpen] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState(null);

  const handleAddFlatOpen = () => setAddFlatOpen(true);
  const handleAddFlatClose = () => setAddFlatOpen(false);
  const handleEditFlatOpen = (flat) => {
    setSelectedFlat(flat);
    setEditFlatOpen(true);
  };
  const handleEditFlatClose = () => setEditFlatOpen(false);

  const handleDeleteFlat = async (id) => {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      await api.delete(`/flat/${id}`);
      toggleRefresh();
    } catch (error) {
      setError({
        open: true,
        severity: "error",
        message: error?.response?.data?.error
      })
      console.error("Error deleting flat:", error);
    }
  };

  const columns = isMobile ? [
    { field: "name", headerName: "Name", width: 150 },
    { field: "size", headerName: "Size", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <>
          <Button color="primary" onClick={() => handleEditFlatOpen(params.row)} startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <IconButton
            color="error"
            onClick={() => handleDeleteFlat(params.row.id)}
          >
            <GridDeleteIcon />
          </IconButton>
        </>
      ),
      width: 120
    },
  ] : [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", width: 200 },
    { field: "size", headerName: "Size", width: 300 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <>
          <Button color="primary" onClick={() => handleEditFlatOpen(params.row)} startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <IconButton
            color="error"
            onClick={() => handleDeleteFlat(params.row.id)}
          >
            <GridDeleteIcon />
          </IconButton>
        </>
      ),
      width: 150
    },
  ];

  useEffect(() => {
    setLoading(true);
    getFlats();
  }, [refresh]);

  async function getFlats() {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      const response = await api.get("/flat");
      setFlats(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching flats:", error);
    } finally {
      setLoading(false);
    }
  }

  function toggleRefresh() {
    setRefresh((prevRefresh) => !prevRefresh);
  }

  return (
    <>
      <Container disableGutters maxWidth="fixed">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Flat List</Typography>
          <Button
            onClick={handleAddFlatOpen}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              position: "fixed",
              right: 20,
              // bottom: 20,
            }}
          >
            NEW
          </Button>
        </Box>
        <Box sx={{ height: "80vh" }}>
          <ThemeProvider theme={theme}>
            <DataGrid
              rows={flats}
              columns={columns}
              autoPageSize
              loading={loading}
              disableRowSelectionOnClick
              // disableColumnSelector
              // disableColumnMenu
              // disableColumnFilter
              // disableDensitySelector
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
        open={addFlatOpen}
        onClose={handleAddFlatClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <CreateFlatModal
            setAddFlatOpen={setAddFlatOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>
      <Modal
        open={editFlatOpen}
        onClose={handleEditFlatClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <EditFlatModal
            flat={selectedFlat}
            setEditFlatOpen={setEditFlatOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>
    </>
  );
}
