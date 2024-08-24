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
import { DataGrid, GridDeleteForeverIcon, GridDeleteIcon, GridToolbar } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import api from "../../../api";
import AddSubcategoryModal from "../../components/Categories/AddSubCategoryModal";
import EditSubcategoryModal from "../../components/Categories/EditSubCategoryModal"
import { useMediaQuery } from "@mui/material";
import ErrorSnackbar from "../../components/errorcomp";
import EditIcon from "@mui/icons-material/Edit";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addSubcategoryOpen, setAddSubcategoryOpen] = useState(false);
  const handleAddSubcategoryOpen = () => setAddSubcategoryOpen(true);
  const handleAddSubcategoryClose = () => setAddSubcategoryOpen(false);
  const [editCategoryOpen, setEditSubcategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleEditCategoryOpen = (category) => {
    setSelectedCategory(category);
    setEditSubcategoryOpen(true);
  };
  const handleEditCategoryClose = () => setEditSubcategoryOpen(false);
  const handleDeleteSubCategory = async (id) => {
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
      { field: "subcategoryName", headerName: "Name", width: 150 },
      // { field: "description", headerName: "Description", width: 200 },
      // { field: "icon", headerName: "Icon URL", width: 150 },
      {
        field: "categoryName",
        headerName: "Category",
        valueGetter: (params) => params.row.category?.categoryName || "",
        width: 150,
      },
      { field: "visible", headerName: "Visible", width: 120 },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params) => (
          <>
            <Button color="primary" onClick={() => handleEditCategoryOpen(params.row)} startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <IconButton
              color="error"
              onClick={() => handleDeleteSubCategory(params.row.id)}
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
      { field: "subcategoryName", headerName: "Name", width: 200 },
      // { field: "description", headerName: "Description", width: 300 },
      // { field: "icon", headerName: "Icon URL", width: 200 },
      {
        field: "categoryName",
        headerName: "Category",
        valueGetter: (params) => params.row.category?.categoryName || "",
        width: 200,
      },
      {
        field: "visible",
        headerName: "Visible",
        valueGetter: (params) => (params.row.visible ? "Yes" : "No"),
        width: 100,
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
              onClick={() => handleDeleteSubCategory(params.row.id)}
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
    getSubcategories();
  }, [refresh]);

  async function getSubcategories() {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      const response = await api.get("/subcategories");
      setSubcategories(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
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
          <Typography variant="h5">SubCategories</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              position: "fixed", right: 20,
              zIndex: 1000
            }}
            onClick={handleAddSubcategoryOpen}
          >
            NEW
          </Button>
        </Box>
        <Box sx={{ height: "80vh" }}>
          <ThemeProvider theme={theme}>
            <DataGrid
              rows={subcategories}
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
        open={addSubcategoryOpen}
        onClose={handleAddSubcategoryClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <AddSubcategoryModal
            setAddSubcategoryOpen={setAddSubcategoryOpen}
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
          <EditSubcategoryModal
            subcategory={selectedCategory}
            setEditSubcategoryOpen={setEditSubcategoryOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>
      <ErrorSnackbar open={error?.open} message={error?.message} handleClose={handleClose} />
    </>
  );
}
