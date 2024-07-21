"use client"
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
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
  TextField
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { GridDeleteIcon } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import api from "@/api"; // Import your API functions
import CreateSizeChartModal from "@/src/components/sizetype/SizeChart/AddSizeChartModal";
import EditSizeChartModal from "@/src/components/sizetype/SizeChart/EditSizeChartModal";

export default function HomePage() {
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [loading, setLoading] = useState(true);
  const [sizeCharts, setSizeCharts] = useState([]);
  const [filteredSizeCharts, setFilteredSizeCharts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addSizeOpen, setAddSizeOpen] = useState(false);
  const [editSizeOpen, setEditSizeOpen] = useState(false);
  const [selectedSizeChart, setSelectedSizeChart] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddSizeOpen = () => setAddSizeOpen(true);
  const handleAddSizeClose = () => setAddSizeOpen(false);
  const handleEditSizeOpen = (sizeChart) => {
    setSelectedSizeChart(sizeChart);
    setEditSizeOpen(true);
  };
  const handleEditSizeClose = () => setEditSizeOpen(false);

  const handleDeleteSizeChart = async (id) => {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      await api.delete(`/sizechart/${id}`);
      toggleRefresh();
    } catch (error) {
      setError({
        open: true,
        severity: "error",
        message: error?.response?.data?.error
      });
      console.error("Error deleting size chart:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getSizeCharts();
  }, [refresh]);

  async function getSizeCharts() {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      const response = await api.get("/sizechart");
      setSizeCharts(response.data.data);
      setFilteredSizeCharts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching size charts:", error);
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
    const filteredData = sizeCharts.filter((sizeChart) =>
      sizeChart.name.toLowerCase().includes(value)
    );
    setFilteredSizeCharts(filteredData);
  };

  const slicedSizeCharts = filteredSizeCharts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Container disableGutters maxWidth="fixed">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Size Chart List</Typography>
          <Button
            onClick={handleAddSizeOpen}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              position: "fixed",
              right: 20,
            }}
          >
            NEW
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
                  <TableCell>Product Name</TableCell>
                  <TableCell>Size Name</TableCell>
                  <TableCell>Width</TableCell>
                  <TableCell>Height</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slicedSizeCharts.map((sizeChart) => (
                  // sizeChart.sizes.map((size, index) => (
                  <TableRow key={`${sizeChart?.id}`}>
                    <TableCell>{sizeChart.name}</TableCell>
                    <TableCell>
                      <ul>
                        {sizeChart?.sizes?.map((dim) => (
                          <li key={dim.id}>{dim.name}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <ul>
                        {sizeChart?.sizes?.map((dim) => (
                          <li key={dim.id}>{dim.width}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <ul>
                        {sizeChart?.sizes?.map((dim) => (
                          <li key={dim.id}>{dim.height}</li>
                        ))}
                      </ul>
                    </TableCell>
                    {/* <TableCell>{size.name}</TableCell>
                      <TableCell>{size.width}</TableCell>
                      <TableCell>{size.height}</TableCell> */}
                    <TableCell>
                      <Button color="primary" onClick={() => handleEditSizeOpen(sizeChart)}>
                        Edit
                      </Button>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteSizeChart(sizeChart.id)}
                      >
                        <GridDeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  // ))
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={filteredSizeCharts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{ alignSelf: 'flex-end' }}
          />
        </Box>
      </Container>
      <Modal
        open={addSizeOpen}
        onClose={handleAddSizeClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <CreateSizeChartModal
            setAddSizeOpen={setAddSizeOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>
      <Modal
        open={editSizeOpen}
        onClose={handleEditSizeClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <EditSizeChartModal
            selectedSizeChart={selectedSizeChart}
            setEditSizeOpen={setEditSizeOpen}
            refresh={toggleRefresh}
          />
        </Box>
      </Modal>

    </>
  );
}
