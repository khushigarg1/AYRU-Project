import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../../api";
import Cookies from "js-cookie";
import ErrorSnackbar from "./errorcomp";

export default function ChangePasswordModal({ open, handleClose }) {
  const [passwordData, setPasswordData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ open: false, severity: "error", message: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const admintoken = Cookies.get("admintoken");
      api.defaults.headers.Authorization = `Bearer ${admintoken}`;
      await api.put("/auth/admin/change-password", passwordData);
      setError({ open: true, severity: "success", message: "Password changed successfully" });
      handleClose();
    } catch (error) {
      setError({ open: true, severity: "error", message: error?.response?.data?.message || "An error occurred while changing password" });
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError({ open: false });
  };

  const handleClickShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="change-password-modal"
      aria-describedby="change-password-modal-description"
    >
      <Box
        p={4}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          textAlign: "center"
        }}
      >
        <Typography variant="h6" mb={2}>Change Password</Typography>
        <TextField
          name="email"
          label="Email"
          value={passwordData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="currentPassword"
          label="Current Password"
          value={passwordData.currentPassword}
          onChange={handleChange}
          type={showCurrentPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle current password visibility"
                  onClick={handleClickShowCurrentPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          name="newPassword"
          label="New Password"
          value={passwordData.newPassword}
          onChange={handleChange}
          type={showNewPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle new password visibility"
                  onClick={handleClickShowNewPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showNewPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {/* <Box mt={2}> */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Changing..." : "Change Password"}
        </Button>
        <Button
          fullWidth

          variant="outlined"
          color="primary"
          onClick={handleClose}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
        {/* </Box> */}
        <ErrorSnackbar open={error?.open} message={error?.message} handleClose={handleCloseSnackbar} />
      </Box>
    </Modal>
  );
}
