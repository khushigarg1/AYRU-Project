"use client"
import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography, TextField, Switch, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "@/api";
import Cookies from "js-cookie";
import ErrorSnackbar from "@/src/components/errorcomp";
import ChangePasswordModal from "@/src/components/resetPassword";

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

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  const fetchAdminDetails = async () => {
    try {
      const token = Cookies.get("token");
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const response = await api.get(`auth/admin/me`);
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      api.defaults.headers.Authorization = `Bearer ${token}`;
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

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" mb={2}>Edit Admin Details</Typography>
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
      </Box>
      <ErrorSnackbar open={error?.open} message={error?.message} handleClose={handleCloseSnackbar} />
      <ChangePasswordModal open={changePasswordModalOpen} handleClose={handleCloseChangePasswordModal} />
    </Container>
  );
}
