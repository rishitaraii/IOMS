import React, { useEffect, useState } from "react";
import {Box,Button,MenuItem,TextField,Typography,IconButton,Stack} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {fetchCustomers,fetchProducts,createOrder,updateOrder,fetchOrder,} from "../../api/axios";
import type {Customer,Product,OrderItemInput,Order,OrderInput,} from "../../types/types";
import { Add, Delete } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
const OrderForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("Pending");
  const [items, setItems] = useState<OrderItemInput[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [custRes, prodRes] = await Promise.all([
        fetchCustomers(),
        fetchProducts(),
      ]);
      setCustomers(custRes.data);
      setProducts(prodRes.data.sort((a, b) =>{
        if (a.status==='active' && b.status==='inactive') return -1;
        if (a.status==='inactive' && b.status==='active') return 1;
        return 0;
      }));
      
      if (id) {
        const orderRes = await fetchOrder(parseInt(id));
        const order: Order = orderRes.data;
        setCustomer(order.customer_details.id);
        setStatus(order.status);
        setItems(
          order.items.map((i) => ({
            product: (i as any).product.id,
            quantity: i.quantity,
          }))
        );
      }
    };
    loadData();
  }, [id]);

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const handleAddItem = () => {
    if (products.length === 0) return;
    setItems([...items, { product: products[0].id, quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleSubmit = async () => {
    if (customer === null) {
      alert("Please select a customer.");
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    const orderData: OrderInput = {
      customer: customer,
      status,
      items,
    };

    try {
      if (id) {
        await updateOrder(parseInt(id), orderData);
        alert("Order updated");
      } else {
        await createOrder(orderData);
        alert("Order created");
      }
      navigate("/orders");
    } catch (err:any) {
      console.error("Failed to submit order", err);
      const msg =
        err?.response?.data?.error || "something went wrong";
      alert(msg);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" gutterBottom>
            {id ? "Edit Order" : "Create Order"}
            </Typography>
          <IconButton onClick={() => navigate("/orders")}>
          <CloseIcon />
          </IconButton>
        </Box>
    
      <Stack spacing={3} mt={2}>
        <Box display="flex" gap={2}>
          <TextField
            select
            fullWidth
            label="Customer"
            value={customer ?? ""}
            onChange={(e) => setCustomer(Number(e.target.value))}
          >
            {customers.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
              (status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              )
            )}
          </TextField>
        </Box>

        <Box>
          <Typography variant="h6" mb={2}>
            Items
          </Typography>

          <Stack spacing={2}>
            {items.map((item, index) => (
              <Box key={index} display="flex" gap={2} alignItems="center">
                <TextField
                  select
                  label="Product"
                  value={item.product}
                  onChange={(e) =>
                    handleItemChange(index, "product", Number(e.target.value))
                  }
                  sx={{ flex: 2 }}
                >
                  {products.map((p) => (
                    <MenuItem key={p.id} value={p.id} disabled={p.status!=="active"}>
                      {p.name} {p.status ===  "inactive"? "(Inactive)":""}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  type="number"
                  label="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", Number(e.target.value))
                  }
                  sx={{ flex: 1 }}
                />

                <IconButton onClick={() => handleRemoveItem(index)} color="error">
                  <Delete />
                </IconButton>
              </Box>
            ))}

            <Box>
              <Button
                startIcon={<Add />}
                onClick={handleAddItem}
                variant="outlined"
                disabled={products.length === 0}
              >
                Add Item
              </Button>
            </Box>
          </Stack>
        </Box>

        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            size="large"
          >
            {id ? "Update Order" : "Create Order"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default OrderForm;
