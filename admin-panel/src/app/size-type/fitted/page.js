"use client"
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Fab,
  IconButton,
  Modal,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField // Import TextField for search input
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import api from "@/api";
import CreateFittedModal from "@/src/components/sizetype/Fitted/AddFittedModal";
import EditFittedModal from "@/src/components/sizetype/Fitted/EditFittedModal";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [loading, setLoading] = useState(true);
  const [fitteds, setFitteds] = useState([]);
  const [filteredFitteds, setFilteredFitteds] = useState([]); // State for filtered data
  const [refresh, setRefresh] = useState(false);
  const [addFittedOpen, setAddFittedOpen] = useState(false);
  const [editFittedOpen, setEditFittedOpen] = useState(false);
  const [selectedFitted, setSelectedFitted] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const handleAddFittedOpen = () => setAddFittedOpen(true);
  const handleAddFittedClose = () => setAddFittedOpen(false);
  const handleEditFittedOpen = (fitted) => {
    setSelectedFitted(fitted);
    setEditFittedOpen(true);
  };
  const handleEditFittedClose = () => setEditFittedOpen(false);

  const handleDeleteFitted = async (id) => {
    const token = Cookies.get("token");
    api.defaults.headers.Authorization = `Bearer ${token}`;
    try {
      await api.delete(`/fitted/${id}`);
      toggleRefresh();
    } catch (error) {
      setError({
        open: true,
        severity: "error",
        message: error?.response?.data?.error
      });
      console.error("Error deleting fitted:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getFitteds();
  }, [refresh]);

  async function getFitteds() {
    const token = Cookies.get("token");
    api.defaults.headers.Authorization = `Bearer ${token}`;
    try {
      const response = await api.get("/fitted");
      setFitteds(response.data.data);
      setFilteredFitteds(response.data.data); // Initialize filtered data with all data
      setLoading(false);
    } catch (error) {
      console.error("Error fetching fitteds:", error);
    } finally {
      setLoading(false);
    }
  }

  function toggleRefresh() {
    setRefresh((prevRefresh) => !prevRefresh);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredData = fitteds.filter((fitted) =>
      fitted.name.toLowerCase().includes(value)
    );
    setFilteredFitteds(filteredData);
  };

  const slicedFitteds = filteredFitteds.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns = isMobile
    ? [
      { field: "name", headerName: "Name", width: 150 },
      {
        field: "dimensions",
        headerName: "Dimensions",
        width: 200,
        renderCell: (params) => (
          <ul>
            {params.row.FittedDimensions.map((dim) => (
              <li key={dim.id}>{dim.dimensions}</li>
            ))}
          </ul>
        )
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params) => (
          <>
            <Button color="primary" onClick={() => handleEditFittedOpen(params.row)} startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <IconButton
              color="error"
              onClick={() => handleDeleteFitted(params.row.id)}
            >
              <GridDeleteIcon />
            </IconButton>
          </>
        ),
        width: 120
      },
    ]
    : [
      { field: "id", headerName: "ID" },
      { field: "name", headerName: "Name", width: 200 },
      {
        field: "dimensions",
        headerName: "Dimensions",
        width: 300,
        renderCell: (params) => (
          <ul>
            {params.row.FittedDimensions.map((dim) => (
              <li key={dim.id}>{dim.dimensions}</li>
            ))}
          </ul>
        )
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params) => (
          <>
            <Button color="primary" onClick={() => handleEditFittedOpen(params.row)} startIcon={<EditIcon />}>
              Edit
            </Button>
            <IconButton
              color="error"
              onClick={() => handleDeleteFitted(params.row.id)}
            >
              <GridDeleteIcon />
            </IconButton>
          </>
        ),
        width: 150
      },
    ];

  return (
    <>
      <Container disableGutters maxWidth="fixed">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Fitted List</Typography>
          <Button
            onClick={handleAddFittedOpen}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              position: "fixed",
              right: 20,
              // bottom: 20,
            }}
          >
            Create Fitted
          </Button>
        </Box>
        <Box sx={{ height: "80vh" }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            margin="normal"
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fitted Name</TableCell>
                  <TableCell>Dimensions</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slicedFitteds.map((
                  fitted) => (
                  <TableRow key={fitted.id}>
                    <TableCell>{fitted.name}</TableCell>
                    <TableCell>
                      <ul>
                        {fitted.FittedDimensions.map((dim) => (
                          <li key={dim.id}>{dim.dimensions}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <Button color="primary" onClick={() => handleEditFittedOpen(fitted)}>
                        Edit
                      </Button>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteFitted(fitted.id)}
                      >
                        <GridDeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={filteredFitteds.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{ alignSelf: 'flex-end' }}
          />
          <Button variant="outlined" onClick={toggleRefresh}>
            Refresh
          </Button>
        </Box>
      </Container>
      <Modal
        open={addFittedOpen}
        onClose={handleAddFittedClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <CreateFittedModal
            setAddFittedOpen={setAddFittedOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>
      <Modal
        open={editFittedOpen}
        onClose={handleEditFittedClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <EditFittedModal
            fitted={selectedFitted}
            setEditFittedOpen={setEditFittedOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>
    </>
  );
}
