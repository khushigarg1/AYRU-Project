"use client";
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '../../api';
import { Box, Grid, Paper, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, useTheme, createTheme, TextField, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const theme = useTheme();


  const fetchDashboardData = async () => {
    const admintoken = Cookies.get('admintoken');
    api.defaults.headers.Authorization = `Bearer ${admintoken}`;
    try {
      // const response = await api.get('/dashboard');

      let url = `/dashboard`;

      // Add query parameters if dates are selected
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await api.get(url);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };
  const ResetFilters = () => {
    setStartDate('')
    setEndDate('');
    fetchDashboardData();
  }

  useEffect(() => {

    fetchDashboardData();
  }, []);
  // useEffect(() => {
  //   fetchDashboardData();
  // }, [startDate, endDate]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const {
    totalUsers,
    totalOrders,
    totalCartItems,
    totalWishlistItems,
    topWishlistItems,
    topCartItems,
    pendingOrders,
    successOrders,
    failedOrders,
    totalProfit,
    totalRevenue,
    totalCost,
    totalSellingPrice,
    totalDiscountedPrice,
    totalItems,
    ordersByCountry,
    ordersByState
  } = dashboardData;

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

  const Revenue = [
    { name: 'Total Cost', value: totalCost },
    { name: 'Total Revenue', value: totalRevenue },
    { name: 'Total Profit', value: totalProfit },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleRowClick = (params) => {
    const itemId = params.row.itemId;
    router.push(`/inventory/${itemId}`);
  };
  const customTheme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            '& .MuiDataGrid-cell': {
              padding: '8px', // Override the default spacing or any other styling
            },
          },
        },
      },
    },
  });
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>

        <Grid container spacing={3}>
          <Grid item xs={6} sm={6}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button fullWidth variant="contained" onClick={fetchDashboardData}>
              Apply Filters
            </Button>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button fullWidth variant="contained" onClick={ResetFilters}>
              Reset Filters
            </Button>
          </Grid>
        </Grid>
        {/* Total Users */}
        <Grid container spacing={2} mt={2}>

          <Grid item xs={6} sm={4} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{totalUsers}</Typography>
            </Paper>
          </Grid>

          {/* Total Orders */}
          <Grid item xs={6} sm={4} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{totalOrders}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Success Orders</Typography>
              <Typography variant="h4">{successOrders}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Failed Orders</Typography>
              <Typography variant="h4">{failedOrders}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Cart Items</Typography>
              <Typography variant="h4">{totalCartItems}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Wishlist Items</Typography>
              <Typography variant="h4">{totalWishlistItems}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Order Items</Typography>
              <Typography variant="h4">{totalItems}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={1}>
          <Grid item xs={6} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Cost</Typography>
              <Typography variant="h4">{totalCost}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4">{totalRevenue}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Profit</Typography>
              <Typography variant="h4">{totalProfit}</Typography>
            </Paper>
          </Grid>
        </Grid>
        {/* 
        <Grid container spacing={2} mt={1}>
          <Grid item xs={6} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total Selling Price</Typography>
              <Typography variant="h4">{totalSellingPrice}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Total discounted Price</Typography>
              <Typography variant="h4">{totalDiscountedPrice}</Typography>
            </Paper>
          </Grid>
        </Grid> */}
        {/* Total Statistics Pie Chart */}
        {/* <Grid item xs={12} md={6}>
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
        </Grid> */}

        {/* Order Statistics Pie Chart */}
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

        {/* Total Revenue Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Total Revenue</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Revenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Revenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Orders By Country Table */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Orders by Country</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Country</TableCell>
                    <TableCell align="right">Total Orders</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(ordersByCountry).map(([country, count], index) => (
                    <TableRow key={index}>
                      <TableCell>{country}</TableCell>
                      <TableCell align="right">{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Orders By State Table */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Orders by State</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>State</TableCell>
                    <TableCell align="right">Total Orders</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(ordersByState).map(([state, count], index) => (
                    <TableRow key={index}>
                      <TableCell>{state}</TableCell>
                      <TableCell align="right">{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Top 50 Cart Items */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <ThemeProvider theme={customTheme}>

              <Typography variant="h6">Top 50 Cart Items</Typography>
              <DataGrid
                autoHeight
                rows={topCartItems.map((item, index) => ({
                  id: index,
                  itemId: item?.inventory?.id,
                  productName: item.inventory.productName,
                  category: item?.inventory?.Category?.categoryName,
                  count: item?.count,
                }))}
                columns={[
                  { field: 'id', headerName: 'Inventory id', width: 50 },
                  { field: 'productName', headerName: 'Product Name', width: 350 },
                  { field: 'category', headerName: 'Category name', width: 150 },
                  { field: 'count', headerName: 'Total Times', width: 150 },
                ]}

                pageSize={5}
                disableSelectionOnClick
                rowsPerPageOptions={[5]}
                // autoPageSize
                loading={loading}
                disableRowSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                onRowClick={handleRowClick}
              />
            </ThemeProvider>
          </Paper>
        </Grid>

        {/* Top 50 Wishlist Items */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <ThemeProvider theme={customTheme}>

              <Typography variant="h6">Top 50 Wishlist Items</Typography>
              <DataGrid
                autoHeight
                rows={topWishlistItems.map((item, index) => ({
                  id: index,
                  itemId: item?.inventory?.id,
                  productName: item.inventory.productName,
                  category: item?.inventory?.Category?.categoryName,
                  count: item?.count,
                }))}
                columns={[
                  { field: 'productName', headerName: 'Product Name', width: 350 },
                  { field: 'category', headerName: 'Category name', width: 150 },
                  { field: 'count', headerName: 'Total Times', width: 150 },
                ]}
                pageSize={5}
                disableSelectionOnClick
                rowsPerPageOptions={[5]}
                // autoPageSize
                loading={loading}
                disableRowSelectionOnClick
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                onRowClick={handleRowClick}
              />
            </ThemeProvider>
          </Paper>
        </Grid>
      </Grid>
    </Box >
  );
};

export default Dashboard;
