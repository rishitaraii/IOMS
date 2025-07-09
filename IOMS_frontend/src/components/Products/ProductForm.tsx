import React, { useEffect, useState } from "react";
import {Box,Button,TextField,Typography,Stack,MenuItem} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {fetchProduct,createProduct,updateProduct} from "../../api/axios";
import type { Product, ProductInput } from "../../types/types";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<ProductInput>({
    name: "",
    sku: "",
    price: 0,
    stock_quantity: 0,
    status: "Active",
  });

  useEffect(() => {
    const load = async () => {
      if (id) {
        const res = await fetchProduct(parseInt(id));
        const product: Product = res.data;
        setForm({
          name: product.name,
          sku: product.sku,
          price: product.price,
          stock_quantity: product.stock_quantity,
          status: product.status,
        });
      }
    };
    load();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock_quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await updateProduct(parseInt(id), form);
        alert("Product updated");
      } else {
        await createProduct(form);
        alert("Product created");
      }
      navigate("/products");
    } catch (err) {
      console.error("Failed to save product", err);
      alert("Something went wrong");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          {id ? "Edit Product" : "Create Product"}
        </Typography>
        <IconButton onClick={() => navigate("/products")}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Stack spacing={3} mt={2}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="SKU"
          name="sku"
          value={form.sku}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Stock Quantity"
          name="stock_quantity"
          type="number"
          value={form.stock_quantity}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          fullWidth
        >
          {["active", "inactive"].map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>

        <Box>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {id ? "Update Product" : "Create Product"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default ProductForm;
