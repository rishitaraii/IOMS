import { Typography, Box, IconButton, Button, Chip } from "@mui/material";
import { Delete, Edit, Add, Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { fetchOrders, deleteOrder } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";
import type { Order } from "../../types/types";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import dayjs from "dayjs";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'delivered' | 'cancelled' | 'thisMonth' | 'previousMonth'>('all');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const res = await fetchOrders();
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id);
      loadOrders();
    } catch (err) {
      console.error("Failed to delete order", err);
    }
  };

  // Filter logic based on filterType
  const filteredOrders = orders.filter((order) => {
    const orderDate = dayjs(order.date);
    const now = dayjs();

    switch (filterType) {
      case 'delivered':
        return order.status === 'Delivered';
      case 'cancelled':
        return order.status === 'Cancelled';
      case 'thisMonth':
        return orderDate.month() === now.month() && orderDate.year() === now.year();
      case 'previousMonth':
        const prevMonth = now.subtract(1, 'month');
        return orderDate.month() === prevMonth.month() && orderDate.year() === prevMonth.year();
      default:
        return true;
    }
  });

  const columns: GridColDef[] = [
    { field: "order_id", headerName: "Order ID", flex: 1 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
       renderCell: (params: GridRenderCellParams) =>
    new Date(params.row.date).toLocaleString(),
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 1,
    renderCell: (params: GridRenderCellParams) => params.row.customer_details.name,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, string>) => (
        <Chip
          label={params.value}
          color={
            params.value === "Delivered"
              ? "success"
              : params.value === "Cancelled"
              ? "error"
              : "default"
          }
          variant="outlined"
        />
      ),
    },
    {
      field: "total_items",
      headerName: "Items",
      type: "number",
      flex: 1,
    },
    {
      field: "total_price",
      headerName: "Total Price",
      flex: 1,
       renderCell: (params: GridRenderCellParams) => `$${params.row.total_price}`,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton onClick={() => navigate(`/orders/${params.row.order_id}/edit`)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.order_id)}>
            <Delete />
          </IconButton>
          <IconButton onClick={() => navigate(`/orders/${params.row.order_id}`)}>
            <Visibility />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Orders</Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => navigate("/orders/create")}>
          Add Order
        </Button>
      </Box>

      {/* Filter Buttons */}
      <Box display="flex" gap={1} mb={2}>
        {[
          { label: "Show All", value: "all", color: "#1976d2" },
          { label: "Delivered", value: "delivered", color: "green" },
          { label: "Cancelled", value: "cancelled", color: "red" },
          { label: "This Month", value: "thisMonth", color: "#ed6c02" },
          { label: "Previous Month", value: "previousMonth", color: "#9c27b0" },
        ].map((btn) => (
          <Button
            key={btn.value}
            onClick={() => setFilterType(btn.value as typeof filterType)}
            variant={filterType === btn.value ? "contained" : "outlined"}
            sx={{
              borderRadius: "16px",
              textTransform: "none",
              color: filterType === btn.value ? "white" : btn.color,
              backgroundColor: filterType === btn.value ? btn.color : "transparent",
              borderColor: btn.color,
              "&:hover": {
                backgroundColor: btn.color,
                color: "white",
              },
            }}
          >
            {btn.label}
          </Button>
        ))}
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredOrders}
          columns={columns}
          getRowId={(row) => row.order_id}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            filter: {
              filterModel: {
                items: [],
                quickFilterLogicOperator: GridLogicOperator.Or,
              },
            },
          }}
          slotProps={{
            toolbar: {
              quickFilterProps: {
                quickFilterParser: (searchInput: string) =>
                  searchInput.split(",").map((v) => v.trim()).filter(Boolean),
              },
            },
          }}
          showToolbar
        />
      </Box>
    </Box>
  );
};

export default Orders;
