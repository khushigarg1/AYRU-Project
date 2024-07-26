"use client"
import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography, IconButton, Modal } from "@mui/material";
import { DataGrid, GridDeleteIcon, GridToolbar } from "@mui/x-data-grid";
import { useTheme, ThemeProvider } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import Cookies from "js-cookie";
import api from "@/api";
import ErrorSnackbar from "@/src/components/errorcomp";
import ClientLoveModal from "@/src/components/ClientLove/AddClientLoveModal";
import EditClientLoveModal from "@/src/components/ClientLove/EditClientLoveModal";
import AddIcon from "@mui/icons-material/Add";
import ImagePopup from "@/src/modals/imagepopup";
import VideoPopup from "@/src/modals/videpopup";
import EditIcon from "@mui/icons-material/Edit";
import { getImage } from "../utils/getImage";

export default function ClientLove() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [clientLoveEntries, setClientLoveEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

  useEffect(() => {
    fetchClientLoveEntries();
  }, []);

  const fetchClientLoveEntries = async () => {
    setLoading(true);
    try {
      const response = await api.get("/clientLoves");
      setClientLoveEntries(response.data.data);
    } catch (error) {
      console.error("Error fetching client love entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleOpenEditModal = (entry) => {
    setSelectedEntry(entry);
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => setEditModalOpen(false);

  const handleOpenVideoModal = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
    setVideoModalOpen(true);
  };

  const handleDeleteEntry = async (id) => {
    const admintoken = Cookies.get("admintoken");
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      await api.delete(`/clientLove/${id}`);
      fetchClientLoveEntries();
    } catch (error) {
      setError({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "An error occurred while deleting the entry"
      });
      console.error("Error deleting entry:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setError({ open: false });
  };

  const handleOpenImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  const handleRefresh = () => {
    fetchClientLoveEntries();
  };

  const columns = isMobile ? [
    { field: "text", headerName: "Text", width: 250 },
    {
      field: "imageUrl",
      headerName: "Image",
      renderCell: (params) => (
        params.value && (
          <img
            src={`https://ayru-jaipur.s3.amazonaws.com/${params.value}`}
            alt="Client Love"
            style={{ width: 80, cursor: "pointer" }}
            onClick={() => handleOpenImageModal(`https://ayru-jaipur.s3.amazonaws.com/${params.value}`)}
          />
        )
      ),
      width: 100
    },
    {
      field: "video",
      headerName: "Video",
      renderCell: (params) => (
        params.value && (
          <Button color="primary" onClick={() => handleOpenVideoModal(params.value)}>
            Play Video
          </Button>
        )
      ),
      width: 100
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <>
          <Button color="primary" onClick={() => handleOpenEditModal(params.row)} startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <IconButton color="error" onClick={() => handleDeleteEntry(params.row.id)}>
            <GridDeleteIcon />
          </IconButton>
        </>
      ),
      width: 120
    },
  ] : [
    { field: "id", headerName: "ID", width: 70 },
    { field: "text", headerName: "Text", width: 400 },
    {
      field: "imageUrl",
      headerName: "Image",
      renderCell: (params) => (
        params.value && (
          <img
            src={`https://ayru-jaipur.s3.amazonaws.com/${params.value}`}
            // src={`https://ayru-jaipur.s3.amazonaws.com/${params.value}`}
            alt="Client Love"
            style={{ width: 100, height: 50, cursor: "pointer" }}
            onClick={() => handleOpenImageModal(`https://ayru-jaipur.s3.amazonaws.com/${params.value}`)}
          />
        )
      ),
      width: 150
    },
    {
      field: "video",
      headerName: "Video",
      renderCell: (params) => (
        params.value && (
          <Button color="primary" onClick={() => handleOpenVideoModal(params.value)}>
            Play Video
          </Button>
        )
      ),
      width: 250
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <>
          <Button color="primary" onClick={() => handleOpenEditModal(params.row)}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <IconButton color="error" onClick={() => handleDeleteEntry(params.row.id)}>
            <GridDeleteIcon />
          </IconButton>
        </>
      ),
      width: 200
    },
  ];

  return (
    <Container disableGutters maxWidth="fixed">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Client Love</Typography>
        <Button
          onClick={handleOpenModal}
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
            rows={clientLoveEntries}
            columns={columns}
            autoPageSize
            loading={loading}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true
              }
            }}
          />
          <Button variant="outlined" onClick={handleRefresh}>
            Refresh
          </Button>
        </ThemeProvider>
      </Box>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box>
          <ClientLoveModal open={modalOpen} handleClose={handleCloseModal} refresh={handleRefresh} />
        </Box>
      </Modal>

      <Modal open={editModalOpen} onClose={handleCloseEditModal}>
        <Box>
          <EditClientLoveModal open={editModalOpen} entry={selectedEntry} handleClose={handleCloseEditModal} refresh={handleRefresh} />
        </Box>
      </Modal>

      <Modal open={imageModalOpen} onClose={handleCloseImageModal}>
        <ImagePopup imageUrl={selectedImage} onClose={handleCloseImageModal} />
      </Modal>
      <Modal open={videoModalOpen} onClose={() => setVideoModalOpen(false)}>
        <Box>
          <VideoPopup open={videoModalOpen} videoUrl={selectedVideoUrl} onClose={() => setVideoModalOpen(false)} />
        </Box>
      </Modal>

      <ErrorSnackbar open={error.open} message={error.message} handleClose={handleCloseSnackbar} />
    </Container>
  );
}
