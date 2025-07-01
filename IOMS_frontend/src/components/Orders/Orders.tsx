import { useEffect, useState } from "react";
import { Typography,Box,Paper,Table,TableBody,TableCell,TableContainer, TableHead,TableRow,IconButton,Button} from "@mui/material";
import { Delete, Visibility, Add, Edit } from "@mui/icons-material";
import { fetchOrders, deleteOrder } from "../../api/axios";
import type { Order } from "../../types/types";
import { useNavigate } from "react-router-dom";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const res = await fetchOrders();
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
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
      console.error("Failed to delete order:", err);
    }
  };


  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Orders</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate('/orders/create')}
        >
          Add Order
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Items</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.order_id}>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
                <TableCell>{order.customer_details?.name || "N/A"}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.total_items}</TableCell>
                <TableCell>${order.total_price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/orders/${order.order_id}`)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(order.order_id)}>
                    <Delete />
                  </IconButton>
                  <IconButton color="primary"
                  onClick={() => navigate(`/orders/${order.order_id}/edit`)}
                >
                    <Edit />
                  </IconButton>


                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Orders;
