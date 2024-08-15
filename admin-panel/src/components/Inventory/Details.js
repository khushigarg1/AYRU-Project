import React from 'react';
import { Grid, Typography } from '@mui/material';

const GroupDetails = ({ details }) => {
  return (
    <Grid container spacing={2}>
      {/* Name */}
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Typography variant="h6" color="primary">
          Name:
        </Typography>
        <Typography variant="body1">{details.productName}</Typography>
      </Grid>

      {/* Status */}
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Typography variant="h6" color="primary">
          Status:
        </Typography>
        <Typography variant="body1">{details.status}</Typography>
      </Grid>

      {/* Product Status */}
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Typography variant="h6" color="primary">
          Product Status:
        </Typography>
        <Typography variant="body1">{details.productstatus}</Typography>
      </Grid>

      {/* Quantity */}
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Typography variant="h6" color="primary">
          Quantity:
        </Typography>
        <Typography variant="body1">{details.quantity}</Typography>
      </Grid>

      {/* Sold Quantity */}
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Typography variant="h6" color="primary">
          Sold Quantity:
        </Typography>
        <Typography variant="body1">{details.soldQuantity}</Typography>
      </Grid>

      {/* Selling Price */}
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Typography variant="h6" color="primary">
          Selling Price:
        </Typography>
        <Typography variant="body1">₹{details.sellingPrice}</Typography>
      </Grid>

      {/* Cost Price */}
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Typography variant="h6" color="primary">
          Cost Price:
        </Typography>
        <Typography variant="body1">₹{details.costPrice}</Typography>
      </Grid>

      {/* Discounted Price */}
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Typography variant="h6" color="primary">
          Discounted Price:
        </Typography>
        <Typography variant="body1">₹{details.discountedPrice}</Typography>
      </Grid>

      {/* Availability */}
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Typography variant="h6" color="primary">
          Availability:
        </Typography>
        <Typography variant="body1">{details.availability === "true" ? 'Available' : 'Not Available'}</Typography>
      </Grid>

      {/* Extra Option Out of Stock */}
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Typography variant="h6" color="primary">
          Extra Option Out of Stock:
        </Typography>
        <Typography variant="body1">{details.extraOptionOutOfStock ? 'Out of Stock' : 'Available'}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Typography variant="h6" color="primary">
          Sale Item:
        </Typography>
        <Typography variant="body1">{details.sale ? 'Sale Item' : 'Not a sale Item'}</Typography>
      </Grid>

    </Grid>
  );
};

export default GroupDetails;
