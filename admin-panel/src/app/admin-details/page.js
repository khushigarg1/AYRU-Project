"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography, TextField, Switch, IconButton, InputAdornment, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../../../api";
import Cookies from "js-cookie";
import ErrorSnackbar from "../../components/errorcomp"
import ChangePasswordModal from "../../components/resetPassword"
import { decodeJWT } from 'aws-amplify/auth';

// Define parseJwt function
const parseJwt = (admintoken) => {
  try {
    return decodeJWT(admintoken);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
}
export default function Home() {
  const [adminDetails, setAdminDetails] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    name: "",
    isActive: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createAdminModalOpen, setCreateAdminModalOpen] = useState(false);
  const [newAdminDetails, setNewAdminDetails] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    name: "",
    isActive: true
  });

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  const fetchAdminDetails = async () => {
    try {
      const admintoken = Cookies.get("admintoken");

      const tokenPayload = parseJwt(admintoken);
      const userId = tokenPayload?.payload?.id;
      api.defaults.headers.Authorization = `Bearer ${admintoken}`;
      const response = await api.get(`/auth/admin/${userId}`);
      setAdminDetails(response?.data?.data);
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setAdminDetails((prevState) => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const handleNewAdminChange = (event) => {
    const { name, value, checked, type } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setNewAdminDetails((prevState) => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const admintoken = Cookies.get("admintoken");
      api.defaults.headers.Authorization = `Bearer ${admintoken}`;
      await api.put("auth/admin/editdetail", adminDetails);
      setError({ open: true, severity: "success", message: "Admin details updated successfully" });
    } catch (error) {
      setError({ open: true, severity: "error", message: error?.response?.data?.message || "An error occurred while updating admin details" });
      console.error("Error updating admin details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    setChangePasswordModalOpen(true);
  };

  const handleCloseChangePasswordModal = () => {
    setChangePasswordModalOpen(false);
  };

  const handleCloseSnackbar = () => {
    setError({ open: false });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCreateAdminSubmit = async () => {
    setLoading(true);
    try {
      await api.post("auth/admin/signup", newAdminDetails);
      setError({ open: true, severity: "success", message: "New admin created successfully" });
      setCreateAdminModalOpen(false);
      setNewAdminDetails({
        email: "",
        password: "",
        phoneNumber: "",
        name: "",
        isActive: true
      });
    } catch (error) {
      setError({ open: true, severity: "error", message: error?.response?.data?.message || "An error occurred while creating a new admin" });
      console.error("Error creating new admin:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h5" mb={2}>Edit Admin Details</Typography>
        {/* Existing Form for Editing Admin Details */}
        <TextField
          name="email"
          label="Email"
          value={adminDetails.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="password"
          label="Password"
          value={adminDetails.password}
          onChange={handleChange}
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          name="phoneNumber"
          label="Phone Number"
          value={adminDetails.phoneNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="name"
          label="Name"
          value={adminDetails.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box mt={2} mb={2}>
          <Typography variant="body1">Active Status</Typography>
          <Switch
            name="isActive"
            checked={adminDetails.isActive}
            onChange={handleChange}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Details"}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleResetPassword}
          disabled={loading}
          sx={{ ml: 2 }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>

        {/* New Button to Open Create Admin Modal */}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setCreateAdminModalOpen(true)}
          sx={{ mt: 2 }}
        >
          Create Admin
        </Button>
      </Box>

      <ErrorSnackbar open={error?.open} message={error?.message} handleClose={handleCloseSnackbar} />
      <ChangePasswordModal open={changePasswordModalOpen} handleClose={handleCloseChangePasswordModal} />

      {/* Create Admin Modal */}
      <Dialog open={createAdminModalOpen} onClose={() => setCreateAdminModalOpen(false)}>
        <DialogTitle>Create New Admin</DialogTitle>
        <DialogContent>
          <TextField
            name="email"
            label="Email"
            value={newAdminDetails.email}
            onChange={handleNewAdminChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="password"
            label="Password"
            value={newAdminDetails.password}
            onChange={handleNewAdminChange}
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            value={newAdminDetails.phoneNumber}
            onChange={handleNewAdminChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="name"
            label="Name"
            value={newAdminDetails.name}
            onChange={handleNewAdminChange}
            fullWidth
            margin="normal"
          />
          <Box mt={2} mb={2}>
            <Typography variant="body1">Active Status</Typography>
            <Switch
              name="isActive"
              checked={newAdminDetails.isActive}
              onChange={handleNewAdminChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateAdminModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateAdminSubmit} color="primary" disabled={loading}>
            {loading ? "Creating..." : "Create Admin"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
