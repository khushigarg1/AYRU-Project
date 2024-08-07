"use client";
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '@/api';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const admintoken = Cookies.get('admintoken');
      api.defaults.headers.Authorization = `Bearer ${admintoken}`;
      try {
        const response = await api.get('/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const { totalUsers, totalOrders, totalCartItems, totalWishlistItems, topWishlistItems, topCartItems,
    pendingOrders,
    successOrders,
    failedOrders, } = dashboardData;

  const pieData = [
    { name: 'Users', value: totalUsers },
    { name: 'Cart Items', value: totalCartItems },
    { name: 'Wishlist Items', value: totalWishlistItems },
  ];
  const pieData2 = [
    { name: 'Failed Orders', value: failedOrders },
    { name: 'Pending Orders', value: pendingOrders },
    { name: 'Completed Orders', value: successOrders },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Total Statistics</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Order Statistics</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData2}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData2.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Top 10 Cart Items</Typography>
            <DataGrid
              autoHeight
              rows={topCartItems.map((item, index) => ({
                id: index,
                productName: item.inventory.productName,
                skuId: item.inventory.skuId,
                costPrice: item.inventory.costPrice,
                sellingPrice: item.inventory.sellingPrice,
                sellingPrice: item.inventory.sellingPrice,
                discountedPrice: item.inventory.discountedPrice,
              }))}
              columns={[
                { field: 'productName', headerName: 'Product Name', width: 200 },
                { field: 'skuId', headerName: 'SKU ID', width: 150 },
                { field: 'costPrice', headerName: 'Cost Price', width: 150 },
                { field: 'sellingPrice', headerName: 'Selling Price', width: 150 },
                { field: 'discountedPrice', headerName: 'Discounted Price', width: 150 },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Top Wishlist Items</Typography>
            <DataGrid
              autoHeight
              rows={topWishlistItems.map((item, index) => ({
                id: index,
                productName: item.inventory.productName,
                skuId: item.inventory.skuId,
                costPrice: item.inventory.costPrice,
                sellingPrice: item.inventory.sellingPrice,
                sellingPrice: item.inventory.sellingPrice,
                discountedPrice: item.inventory.discountedPrice,
              }))}
              columns={[
                { field: 'productName', headerName: 'Product Name', width: 350 },
                { field: 'skuId', headerName: 'SKU ID', width: 150 },
                { field: 'costPrice', headerName: 'Cost Price', width: 150 },
                { field: 'sellingPrice', headerName: 'Selling Price', width: 150 },
                { field: 'discountedPrice', headerName: 'Discounted Price', width: 150 },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
