"use client";
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
import AddColorModal from "@/src/components/Color/AddcolorModal";
import EditColorModal from "@/src/components/Color/EditColorModal";
import { useMediaQuery } from "@mui/material";
import CustomSnackbar from "@/src/components/snackbar";
import ErrorSnackbar from "@/src/components/errorcomp";
import EditIcon from "@mui/icons-material/Edit";

export default function HomeColor() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [loading, setLoading] = useState(true);
  const [colors, setColors] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addColorOpen, setAddColorOpen] = useState(false);
  const [editColorOpen, setEditColorOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleAddColorOpen = () => setAddColorOpen(true);
  const handleAddColorClose = () => setAddColorOpen(false);
  const handleEditColorOpen = (color) => {
    setSelectedColor(color);
    setEditColorOpen(true);
  };
  const handleEditColorClose = () => setEditColorOpen(false);

  const handleDeleteColor = async (id) => {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      await api.delete(`/color/${id}`);
      toggleRefresh();
    } catch (error) {
      setError({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "An error occurred while deleting the color.",
      });
    }
  };

  const columns = isMobile
    ? [
      { field: "name", headerName: "Name", width: 150 },
      { field: "colorCode", headerName: "Color Code", width: 150 },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params) => (
          <>
            <Button
              color="primary"
              onClick={() => handleEditColorOpen(params.row)}
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <IconButton
              color="error"
              onClick={() => handleDeleteColor(params.row.id)}
            >
              <GridDeleteIcon />
            </IconButton>
          </>
        ),
        width: 150
      },
    ]
    : [
      { field: "id", headerName: "ID" },
      { field: "name", headerName: "Name", width: 200 },
      { field: "colorCode", headerName: "Color Code", width: 200 },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params) => (
          <>
            <Button
              color="primary"
              onClick={() => handleEditColorOpen(params.row)}
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <IconButton
              color="error"
              onClick={() => handleDeleteColor(params.row.id)}
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
    getColors();
  }, [refresh]);

  async function getColors() {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      const response = await api.get("/color");
      setColors(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching colors:", error);
    } finally {
      setLoading(false);
    }
  }

  function toggleRefresh() {
    setRefresh((prevRefresh) => !prevRefresh);
  }
  const handleClose = () => {
    setError({ open: false })
  }
  return (
    <>
      <Container disableGutters maxWidth="fixed">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Colors</Typography>
          <Button
            onClick={handleAddColorOpen}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              position: "fixed",
              right: 20,
              zIndex: 1000
            }}
          >
            NEW
          </Button>
        </Box>
        <Box sx={{ height: "80vh" }}>
          <ThemeProvider theme={theme}>
            <DataGrid
              rows={colors}
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
        open={addColorOpen}
        onClose={handleAddColorClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <AddColorModal
            setAddColorOpen={setAddColorOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>
      <Modal
        open={editColorOpen}
        onClose={handleEditColorClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <EditColorModal
            color={selectedColor}
            setEditColorOpen={setEditColorOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>
      <ErrorSnackbar open={error?.open} message={error?.message} handleClose={handleClose} />
    </>
  );
}
