// OrderDetails.jsx
"use client";
import React from 'react';
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Autocomplete,
} from '@mui/material';
import axios from 'axios';
import api from '../../../api';

const TrekkingDetails = ({ order, getOrder }) => {
  const [editMode, setEditMode] = React.useState(false);
  const [deliveryStatus, setDeliveryStatus] = React.useState(order?.deliveryStatus || '');
  const [imageUrl, setImageUrl] = React.useState(order?.imageurl || '');
  const [courierName, setCourierName] = React.useState(order?.couriername || '');
  const [trackingId1, setTrackingId1] = React.useState(order?.trekkingId1 || '');
  const [trackingId2, setTrackingId2] = React.useState(order?.trekkingId2 || '');
  const [trackingLink, setTrackingLink] = React.useState(order?.trekkinglink || '');

  const handleSave = async () => {
    try {
      await api.put(`order/${order.id}`, {
        deliveryStatus,
        imageurl: imageUrl,
        couriername: courierName,
        trekkingId1: trackingId1,
        trekkingId2: trackingId2,
        trekkinglink: trackingLink,
      });
      setEditMode(false);
      getOrder();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Dispatched', value: 'dispatched' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div sx={{ width: "100%" }}>
      {editMode ? (
        <div>
          <TextField
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Courier Name"
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Tracking ID 1"
            value={trackingId1}
            onChange={(e) => setTrackingId1(e.target.value)}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Tracking ID 2"
            value={trackingId2}
            onChange={(e) => setTrackingId2(e.target.value)}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Tracking Link"
            value={trackingLink}
            onChange={(e) => setTrackingLink(e.target.value)}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <FormControl fullWidth style={{ marginBottom: '10px', width: '100%' }}>
            <Autocomplete
              value={statusOptions.find(option => option.value === deliveryStatus) || null}
              onChange={(event, newValue) => setDeliveryStatus(newValue?.value || '')}
              options={statusOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField {...params} label="Delivery Status" variant="outlined" />
              )}
              sx={{ width: '100%', maxWidth: '100%' }}
            />
          </FormControl>
          {/* <FormControl fullWidth style={{
            marginBottom: '10px',
            width: "100%"
          }}>
            <InputLabel>Delivery Status</InputLabel>
            <Select
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
              sx={{
                width: '100%',
                maxWidth: '100%', // Ensure it does not exceed the container width
                boxSizing: 'border-box' // Include padding and border in the element's total width and height
              }}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="dispatched">Dispatched</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
            </Select>
          </FormControl> */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            style={{ marginRight: '10px' }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <Typography variant="h6">Order Details</Typography>
          <Typography>Order ID: {order?.orderid}</Typography>
          <Typography variant="body2">User Name: {order?.user?.firstName} {order?.user?.lastName}</Typography>
          <Typography>Courier Name: {order?.couriername}</Typography>
          <Typography>Tracking Id1: {order?.trekkingId1}</Typography>
          <Typography>Tracking Id2: {order?.trekkingId2}</Typography>
          <Typography>Tracking Link: {order?.trekkinglink}</Typography>
          <Typography>Status: {order?.status}</Typography>
          <Typography>Delivery Status: {order?.deliveryStatus}</Typography>
          <Typography>Order Date: {formatDate(order?.createdAt)}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditMode(true)}
            style={{ marginTop: '10px' }}
          >
            Edit
          </Button>
        </>
      )}
    </div>
  );
};

export default TrekkingDetails;
