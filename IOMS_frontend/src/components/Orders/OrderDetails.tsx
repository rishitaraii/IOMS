import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchOrder } from "../../api/axios";
import type { Order} from "../../types/types";
import {Typography,Box,Card,CardContent,List,ListItem,ListItemText,} from "@mui/material";

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await fetchOrder(Number(id));
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      }
    };

    loadOrder();
  }, [id]);

  if (!order) {
    return <Typography>Loading order details...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Order #{order.order_id}
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Customer Details</Typography>
          <Typography>Name: {order.customer_details.name}</Typography>
          <Typography>Email: {order.customer_details.email}</Typography>
          <Typography>Phone: {order.customer_details.phone}</Typography>
          <Typography>Address: {order.customer_details.address}</Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Order Summary</Typography>
          <Typography>Status: {order.status}</Typography>
          <Typography>Date: {new Date(order.date).toLocaleString()}</Typography>
          <Typography>Total Items: {order.total_items}</Typography>
          <Typography>Total Price: ₹{order.total_price}</Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Items</Typography>
          <List>
            {order.items.map((item, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={item.product.name}
                  secondary={`Price: ₹${item.product.price} × ${item.quantity} = ₹${item.product.price * item.quantity}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderDetails;
