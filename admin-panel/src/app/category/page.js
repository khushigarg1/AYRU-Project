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
import api from "../../../api";
import AddCategoryModal from "../../components/Categories/AddCategoryModel"
import EditCategoryModal from "../../components/Categories/EditCategoryModal";
import { useMediaQuery } from "@mui/material";
import ErrorSnackbar from "../../components/errorcomp";
import EditIcon from "@mui/icons-material/Edit";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pageSize, setPageSize] = useState(5);

  const handleAddUserOpen = () => setAddUserOpen(true);
  const handleAddUserClose = () => setAddUserOpen(false);
  const handleEditCategoryOpen = (category) => {
    setSelectedCategory(category);
    setEditCategoryOpen(true);
  };
  const handleEditCategoryClose = () => setEditCategoryOpen(false);

  const handleDeleteCategory = async (id) => {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      await api.delete(`/category/${id}`);
      toggleRefresh();
    } catch (error) {
      setError({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "An error occurred while deleting the category.",
      });
    }
  };

  const columns = isMobile
    ? [
      { field: "categoryName", headerName: "Name", width: 150 },
      // { field: "description", headerName: "Description", width: 200 },
      // { field: "icon", headerName: "Icon URL", width: 150 },
      {
        field: "visible",
        headerName: "Visible",
        valueGetter: (params) => (params.row.visible ? "Yes" : "No"),
        width: 120,
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params) => (
          <>
            <Button
              color="primary"
              onClick={() => handleEditCategoryOpen(params.row)}
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <IconButton
              color="error"
              onClick={() => handleDeleteCategory(params.row.id)}
            >
              <GridDeleteIcon />
            </IconButton>
          </>
        ),
        width: 120,
      },
    ]
    : [
      { field: "id", headerName: "ID" },
      { field: "categoryName", headerName: "Name", width: 200 },
      // { field: "description", headerName: "Description", width: 300 },
      // { field: "icon", headerName: "Icon URL", width: 300 },
      {
        field: "visible",
        headerName: "Visible",
        valueGetter: (params) => (params.row.visible ? "Yes" : "No"),
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params) => (
          <>
            <Button
              color="primary"
              onClick={() => handleEditCategoryOpen(params.row)}
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <IconButton
              color="error"
              onClick={() => handleDeleteCategory(params.row.id)}
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
    getCategories();
  }, [refresh]);

  async function getCategories() {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
          <Typography variant="h5">Categories</Typography>
          <Button
            onClick={handleAddUserOpen}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              position: "fixed",
              right: 20,
              zIndex: 1000
              // bottom: 20,
            }}
          >
            NEW
          </Button>
        </Box>
        <Box sx={{ height: "80vh" }}>
          <ThemeProvider theme={theme}>
            <DataGrid
              rows={categories}
              columns={columns}
              // autoPageSize

              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 20]}
              pagination
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
        open={addUserOpen}
        onClose={handleAddUserClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <AddCategoryModal
            setAddUserOpen={setAddUserOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>
      <Modal
        open={editCategoryOpen}
        onClose={handleEditCategoryClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <EditCategoryModal
            category={selectedCategory}
            setEditCategoryOpen={setEditCategoryOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>
      {/* <CustomSnackbar open={error.open} severity={error.severity} message={error.message} /> */}
      <ErrorSnackbar open={error?.open} message={error?.message} handleClose={handleClose} />
    </>
  );
}
